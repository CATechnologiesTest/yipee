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
	listenersByNS map[string][]chan updatemsg
	listenerLock  sync.Mutex
	objectsByNS   *CacheClient
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
		listenersByNS = make(map[string][]chan updatemsg)
		objectsByNS = NewCache(0, 0)
		go startWatchers()
	})
}

func makeStatusMessages(nsname string) []*updatemsg {
	cv := objectsByNS.Lookup(nsname)
	if cv == nil {
		return nil
	}
	nsobjs := cv.(*CacheClient)
	var allmsgs []*updatemsg
	controllers, pods := getNSControllersAndPods(nsobjs)
	for _, c := range controllers {
		meta := c["metadata"].(map[string]interface{})
		replicas := getReplicaCount(c)
		active := getActiveCount(c)
		cid := meta["uid"].(string)
		udata := updatedata{
			"deployment-status", // xxx
			calculateStatus(replicas, active),
			replicas,
			active,
			// xxx: this is currently using all pods in namespace.
			// it's gotta just use the pods belonging to current controller
			// (resolve that by following owner refs through replicasets
			// back to controller, ala findProgenitor in js version)
			// testcase for this is kube-system namespace where a number
			// of pods have restarts.  We currently show every controller
			// in the namespace with the same number of restarts...
			getRestartCount(pods),
			cid,
		}
		msg := &updatemsg{udata}
		allmsgs = append(allmsgs, msg)
	}
	return allmsgs
}

func sendInitialStatus(nsname string, statusChan chan updatemsg) {
	msglist := makeStatusMessages(nsname)
	for _, m := range msglist {
		statusChan <- *m
	}
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
		nsname := meta["namespace"].(string)
		id := meta["uid"].(string)
		if n.Type == "ADDED" || n.Type == "MODIFIED" {
			var nscache *CacheClient
			if oc := objectsByNS.Lookup(nsname); oc != nil {
				nscache = oc.(*CacheClient)
			} else {
				nscache = NewCache(0, 0)
				objectsByNS.Add(nsname, nscache)
			}
			nscache.Add(id, obj)
		} else if n.Type == "DELETED" {
			if oc := objectsByNS.Lookup(nsname); oc != nil {
				nscache := oc.(*CacheClient)
				nscache.Remove(id)
			}
		}
		listenerLock.Lock()
		// xxx: build update object once here and send it to
		// all listeners.  Seems dumb for them to all build it
		// themselves
		if llist, ok := listenersByNS[nsname]; ok {
			updlist := makeStatusMessages(nsname)
			log.Infof("notify listeners for %s", nsname)
			for _, c := range llist {
				for _, msg := range updlist {
					c <- *msg
				}
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

func isController(kind string) bool {
	switch kind {
	case "Deployment", "DaemonSet", "StatefulSet":
		return true
	default:
		return false
	}
}

func getNSControllersAndPods(nsobjs *CacheClient) ([]JsonObject, []JsonObject) {
	var controllers []JsonObject
	var pods []JsonObject
	nsobjs.ForEach(
		func(key string, data interface{}) {
			obj := data.(JsonObject)
			kind := obj["kind"].(string)
			if kind == "Pod" {
				pods = append(pods, obj)
			} else if isController(kind) {
				controllers = append(controllers, obj)
			}
		})
	return controllers, pods
}

func addListener(nsname string, lchan chan updatemsg) {
	listenerLock.Lock()
	var listeners []chan updatemsg
	if l, ok := listenersByNS[nsname]; ok {
		listeners = l
	}
	listeners = append(listeners, lchan)
	listenersByNS[nsname] = listeners
	listenerLock.Unlock()
}

func removeListener(nsname string, lchan chan updatemsg) {
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

func getReplicaCount(ctlr JsonObject) int {
	spec := ctlr["spec"].(map[string]interface{})
	kind := ctlr["kind"].(string)
	replicas := 1
	if kind != "DaemonSet" {
		if rep, ok := spec["replicas"].(float64); ok {
			replicas = int(rep)
		} else {
			log.Error("can't get replicas")
		}
	}
	return replicas
}

func getActiveCount(ctlr JsonObject) int {
	status := ctlr["status"].(map[string]interface{})
	kind := ctlr["kind"].(string)
	active := 0
	if kind == "DaemonSet" {
		if ready, ok := status["numberReady"].(float64); ok {
			active = int(ready)
		} else {
			log.Error("can't get numberReady")
		}
	} else {
		if ready, ok := status["readyReplicas"].(float64); ok {
			active = int(ready)
		} else {
			log.Error("can't get readyReplicas")
		}
	}
	return active
}

func getRestartCount(pods []JsonObject) int {
	restarts := 0
	for _, p := range pods {
		if status, ok := p["status"].(map[string]interface{}); ok {
			fmt.Println("got pod status")
			if v, ok := status["containerStatuses"]; ok {
				if cstats, ok := v.([]interface{}); ok {
					fmt.Println("got containerstatuses")
					for _, cs := range cstats {
						if cstat, ok := cs.(map[string]interface{}); ok {
							if crs, ok := cstat["restartCount"].(float64); ok {
								fmt.Println("got a container stat", crs)
								restarts = restarts + int(crs)
							}
						}
					}
				}
			}
		}
	}
	return restarts
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
				nsname := jobj["namespace"].(string)
				log.Infof("subscribe for ns %s", nsname)
				addListener(nsname, statusChan)
				sendInitialStatus(nsname, statusChan)
			case "unsubscribe":
				// remove my channel from listeners
				nsname := jobj["namespace"].(string)
				log.Infof("unsubscribe for ns %s", nsname)
				removeListener(nsname, statusChan)
			}
		} else {
			log.Errorf("bad/unknown message -- neither string nor obj",
				string(msgbytes))
		}
	}
}
