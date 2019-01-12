package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strings"
	"sync"
	"time"
)

var (
	statusOnce    sync.Once
	upgrader      *websocket.Upgrader
	listenersByNS map[string][]chan bool
	listenerLock  sync.Mutex
	objCache      *CacheClient
)

func initStatus(router *mux.Router) {
	router.HandleFunc("/primus", websocketHandler).Methods(http.MethodGet)
	statusOnce.Do(func() {
		initWatchers()
		upgrader = &websocket.Upgrader{
			// ReadBufferSize:  1024,
			// WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}
		listenersByNS = make(map[string][]chan bool)
		objCache = NewCache(0, 0)
		go startWatchers()
	})
}

func startWatchers() {
	notifs := make(chan Notification)
	watchAll(notifs, "Pod", "ReplicaSet", "Deployment",
		"StatefulSet", "DaemonSet")
	log.Info("started all watchers")
	for {
		n := <-notifs
		obj := n.Object
		meta := obj["metadata"].(map[string]interface{})
		id := meta["uid"].(string)
		if n.Type == "ADDED" || n.Type == "MODIFIED" {
			objCache.Add(id, obj)
		} else if n.Type == "DELETED" {
			objCache.Remove(id)
		}
		nsname := meta["namespace"].(string)
		listenerLock.Lock()
		if llist, ok := listenersByNS[nsname]; ok {
			log.Infof("notify listeners for %s", nsname)
			for _, c := range llist {
				c <- true
			}
		}
		listenerLock.Unlock()
	}
}

func statusWriter(
	conn *websocket.Conn,
	updates <-chan updatemsg,
	stop <-chan bool) {

	log.Debug("ws statusWriter running")
	for {
		var msg interface{}
		select {
		case u, ok := <-updates:
			if !ok {
				return
			}
			msg = u
		case _, ok := <-stop:
			if !ok {
				return
			}
		case <-time.After(time.Second * 10):
			msg = fmt.Sprintf("primus::ping::%d", time.Now().Unix())
		}
		if err := conn.WriteJSON(msg); err != nil {
			log.Error("statusWriter WriteJSON error", err, msg)
			break
		}
	}
}

func makeStatusWriter(conn *websocket.Conn, stop <-chan bool) chan updatemsg {
	updateChan := make(chan updatemsg)
	go statusWriter(conn, updateChan, stop)
	return updateChan
}

type updatedata struct {
	Type              string `json:"type"`
	Status            string `json:"status"`
	RequestedReplicas int    `json:"requested-replicas"`
	ActiveReplicas    int    `json:"active-replicas"`
	RestartCount      int    `json:"restart-count"`
	Cgroup            string `json:"cgroup"`
}

type updatemsg struct {
	Update updatedata `json:"update"`
}

func calculateStatus(replicas, active int) string {
	if active == 0 {
		return "red"
	} else if active < replicas {
		return "yellow"
	} else {
		return "green"
	}
}

type nsobjs struct {
	controllers []JsonObject
	pods        []JsonObject
}

func getNamespaceObjects(nsname string) ([]JsonObject, []JsonObject) {
	var controllers []JsonObject
	var pods []JsonObject
	objCache.ForEach(
		func(key string, data interface{}) {
			obj := data.(JsonObject)
			kind := obj["kind"].(string)
			meta := obj["metadata"].(map[string]interface{})
			ons := meta["namespace"].(string)
			if ons == nsname {
				if kind == "Pod" {
					pods = append(pods, obj)
				} else {
					controllers = append(controllers, obj)
				}
			}
		})
	return controllers, pods
}

func addListener(nsname string, lchan chan bool) {
	listenerLock.Lock()
	var listeners []chan bool
	if l, ok := listenersByNS[nsname]; ok {
		listeners = l
	}
	listeners = append(listeners, lchan)
	listenersByNS[nsname] = listeners
	listenerLock.Unlock()
}

func removeListener(nsname string, lchan chan bool) {
	listenerLock.Lock()
	if listeners, ok := listenersByNS[nsname]; ok {
		idx := -1
		for i, c := range listeners {
			if c == lchan {
				idx = i
				break
			}
		}
		if idx > -1 {
			listeners = append(listeners[:idx], listeners[idx+1:]...)
		}
		if len(listeners) > 0 {
			listenersByNS[nsname] = listeners
		} else {
			delete(listenersByNS, nsname)
		}
	}
	listenerLock.Unlock()
}

func getControllerCounts(ctlr JsonObject) (int, int) {
	spec := ctlr["spec"].(map[string]interface{})
	status := ctlr["status"].(map[string]interface{})
	active := 0
	if nr, ok := status["readyReplicas"].(float64); ok {
		active = int(nr)
	} else {
		log.Error("can't get readyReplicas")
	}
	replicas := 1
	if rep, ok := spec["replicas"].(float64); ok {
		replicas = int(rep)
	} else {
		log.Error("can't get replicas")
	}
	return replicas, active
}

func getRestartCount(pods []JsonObject) int {
	restarts := 0
	for _, p := range pods {
		if status, ok := p["status"].(map[string]interface{}); ok {
			if cstats, ok :=
				status["containerStatuses"].([]map[string]interface{}); ok {
				for _, cs := range cstats {
					crs := cs["restartCount"].(float64)
					restarts = restarts + int(crs)
				}
			}
		}
	}
	return restarts
}

func sendStatusMessages(status chan updatemsg, nsname string) {
	controllers, pods := getNamespaceObjects(nsname)
	for _, c := range controllers {
		meta := c["metadata"].(map[string]interface{})
		replicas, active := getControllerCounts(c)
		cid := meta["uid"].(string)
		udata := updatedata{
			"deployment-status", // xxx
			calculateStatus(replicas, active),
			replicas,
			active,
			getRestartCount(pods),
			cid,
		}
		msg := updatemsg{udata}
		status <- msg
	}
}

func nsListen(nsname string, status chan updatemsg, stop chan bool) {
	myupdates := make(chan bool)
	addListener(nsname, myupdates)
	defer removeListener(nsname, myupdates)
	defer close(myupdates)

	log.Infof("send initial status for %s", nsname)
	// send current status to new subscriber
	sendStatusMessages(status, nsname)

	for {
		select {
		case <-myupdates:
			// namespace updated -- send current status
			sendStatusMessages(status, nsname)
		case _, ok := <-stop:
			if !ok {
				return
			}
		}
	}
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Errorf("ws upgrade error %v\n", err)
		return
	}
	defer conn.Close()

	stopper := make(chan bool)
	defer close(stopper)
	statusChan := makeStatusWriter(conn, stopper)
	var subscribeStopper chan bool
	for {
		_, msgbytes, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Infof("error: %v, user-agent: %v", err, r.Header.Get("User-Agent"))
			} else {
				log.Debug("websocket closed")
			}
			return
		}
		var jmsg interface{}
		if err := json.Unmarshal(msgbytes, &jmsg); err != nil {
			log.Errorf("json unmarshal error", err)
			continue
		}
		if s, ok := jmsg.(string); ok && strings.HasPrefix(s, "primus::") {
			continue
		} else if jobj, ok := jmsg.(map[string]interface{}); ok {
			action := jobj["msg"].(string)
			switch action {
			case "subscribe":
				log.Infof("subscribe for ns %s", jobj["namespace"])
				nsname := jobj["namespace"].(string)
				subscribeStopper = make(chan bool)
				go nsListen(nsname, statusChan, subscribeStopper)
			case "unsubscribe":
				// remove my channel from listeners
				log.Infof("unsubscribe for ns %s", jobj["namespace"])
				if subscribeStopper != nil {
					close(subscribeStopper)
					subscribeStopper = nil
				}
			}
		} else {
			log.Errorf("bad/unknown message -- neither string nor obj",
				string(msgbytes))
		}
	}
}
