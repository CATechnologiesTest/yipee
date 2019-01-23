package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
)

var (
	statusOnce     sync.Once
	upgrader       *websocket.Upgrader
	wslisteners    []chan JsonObject
	wslistenerLock sync.Mutex
	listenersByNS  map[string][]chan JsonObject
	listenerLock   sync.Mutex
	objectsByNS    *CacheClient
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
		listenersByNS = make(map[string][]chan JsonObject)
		objectsByNS = NewCache(0, 0)
		if getFromEnv(INSTALL_TYPE, STATIC_INSTALL) == LIVE_INSTALL {
			go startWatchers()
		}
	})
}

func startWatchers() {
	notifs := make(chan Notification)
	watchAll(notifs, "Pod", "ReplicaSet", "Deployment",
		"StatefulSet", "DaemonSet", "Namespace")
	log.Debug("started all watchers")
	for {
		n := <-notifs
		obj := n.Object
		nsnamekey := "namespace"
		if obj["kind"].(string) == "Namespace" {
			nsnamekey = "name"
		}
		nsnotif := make(JsonObject)
		meta := obj["metadata"].(map[string]interface{})
		nsname := meta[nsnamekey].(string)
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
			nsstatus := makeNamespaceStatus(nscache)
			notifobj := make(JsonObject)
			notifobj["namespace"] = nsname
			notifobj["status"] = nsstatus
			nsnotif["namespaceUpdate"] = notifobj
		} else if n.Type == "DELETED" {
			if oc := objectsByNS.Lookup(nsname); oc != nil {
				nscache := oc.(*CacheClient)
				nscache.Remove(id)
			}
			nsobj := make(JsonObject)
			nsobj["namespace"] = nsname
			nsnotif["namespaceDelete"] = nsobj
		}

		wslistenerLock.Lock()
		for _, c := range wslisteners {
			c <- nsnotif
		}
		wslistenerLock.Unlock()

		listenerLock.Lock()
		if llist, ok := listenersByNS[nsname]; ok {
			updlist := makeStatusMessages(nsname)
			log.Debugf("notify %d listeners for %s", len(llist), nsname)
			for _, c := range llist {
				for _, msg := range updlist {
					c <- *msg
				}
			}
		} else {
			log.Debugf("no listeners for ns %s", nsname)
		}
		listenerLock.Unlock()
	}
}

func makeNamespaceStatus(nscache *CacheClient) *NsStatus {
	nsstatus := NsStatus{}
	nsstatus.Status = "green"
	podcnt := 0
	containercnt := 0
	nscache.ForEach(
		func(key string, data interface{}) {
			obj := data.(JsonObject)
			kind := obj["kind"].(string)
			meta := obj["metadata"].(map[string]interface{})
			spec := obj["spec"].(map[string]interface{})
			status := obj["status"].(map[string]interface{})
			if kind == "Pod" {
				podcnt++
				containers := spec["containers"].([]interface{})
				containercnt += len(containers)
			} else if kind == "Namespace" {
				nsstatus.Name = meta["name"].(string)
				nsstatus.DateCreated = meta["creationTimestamp"].(string)
				nsstatus.Phase = status["phase"].(string)
			} else if isController(kind) {
				// controller -- get configured and ready counts and
				// use to rollup overall status
				specReplicas := 0
				readyReplicas := 0
				if kind == "DaemonSet" {
					specReplicas = 1
					if rr, ok := status["numberReady"]; ok {
						readyReplicas = int(rr.(float64))
					}
				} else {
					if sr, ok := spec["replicas"]; ok {
						specReplicas = int(sr.(float64))
					}
					if rr, ok := status["readyReplicas"]; ok {
						readyReplicas = int(rr.(float64))
					}
				}
				if nsstatus.Status != "red" &&
					readyReplicas > 0 && readyReplicas < specReplicas {
					nsstatus.Status = "yellow"
				} else if specReplicas > 0 && readyReplicas == 0 {
					nsstatus.Status = "red"
				}
			}
		})
	nsstatus.PodCount = podcnt
	nsstatus.ContainerCount = containercnt
	return &nsstatus
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

func makeStatusMessages(nsname string) []*JsonObject {
	cv := objectsByNS.Lookup(nsname)
	if cv == nil {
		return nil
	}
	nsobjs := cv.(*CacheClient)
	var allmsgs []*JsonObject
	controllers, pods := getNSControllersAndPods(nsobjs)
	for _, c := range controllers {
		meta := c["metadata"].(map[string]interface{})
		replicas := getReplicaCount(c)
		active := getActiveCount(c)
		cid := meta["uid"].(string)
		cpods := getPodsForController(nsobjs, pods, cid)
		// XXX: coordinate with UI on "type".  The old UI only
		// handled a type of "deployment-status" so we used that for
		// all controllers...
		udata := updatedata{
			"deployment-status",
			calculateStatus(replicas, active),
			replicas,
			active,
			getRestartCount(cpods),
			cid,
		}
		msg := make(JsonObject)
		msg["update"] = udata
		allmsgs = append(allmsgs, &msg)
	}
	return allmsgs
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

func getReplicaCount(ctlr JsonObject) int {
	spec := ctlr["spec"].(map[string]interface{})
	kind := ctlr["kind"].(string)
	replicas := 1
	if kind != "DaemonSet" {
		if rep, ok := spec["replicas"].(float64); ok {
			replicas = int(rep)
		} else {
			log.Errorf("can't get replicas for kind %s in spec %v",
				kind, spec)
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
			log.Errorf("can't get numberReady from daemonset status %v", status)
		}
	} else {
		if ready, ok := status["readyReplicas"].(float64); ok {
			active = int(ready)
		} else {
			log.Errorf("can't get readyReplicas from status %v", status)
		}
	}
	return active
}

func getRestartCount(pods []JsonObject) int {
	restarts := 0
	for _, p := range pods {
		if status, ok := p["status"].(map[string]interface{}); ok {
			if v, ok := status["containerStatuses"]; ok {
				if cstats, ok := v.([]interface{}); ok {
					for _, cs := range cstats {
						if cstat, ok := cs.(map[string]interface{}); ok {
							if crs, ok := cstat["restartCount"].(float64); ok {
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

func findProgenitor(nsobjs *CacheClient, uid string) string {
	o := nsobjs.Lookup(uid)
	if o == nil {
		return uid
	}
	obj := o.(JsonObject)
	meta := obj["metadata"].(map[string]interface{})
	if or, ok := meta["ownerReferences"].([]interface{}); ok {
		for _, r := range or {
			ref := r.(map[string]interface{})
			if ref["controller"].(bool) {
				return findProgenitor(nsobjs, ref["uid"].(string))
			}
		}
	}
	return uid
}

func getPodsForController(
	nsobjs *CacheClient,
	pods []JsonObject,
	cid string) []JsonObject {

	var psForC []JsonObject
	for _, p := range pods {
		pmeta := p["metadata"].(map[string]interface{})
		pid := pmeta["uid"].(string)
		if findProgenitor(nsobjs, pid) == cid {
			psForC = append(psForC, p)
		}
	}
	return psForC
}

func addWsListener(lchan chan JsonObject) {
	wslistenerLock.Lock()
	wslisteners = append(wslisteners, lchan)
	wslistenerLock.Unlock()
}

func removeWsListener(lchan chan JsonObject) {
	wslistenerLock.Lock()
	idx := -1
	for i, c := range wslisteners {
		if c == lchan {
			idx = i
			break
		}
	}
	if idx > -1 {
		wslisteners = append(wslisteners[:idx], wslisteners[idx+1:]...)
	}
	wslistenerLock.Unlock()
}

func addListener(nsname string, lchan chan JsonObject) {
	listenerLock.Lock()
	var listeners []chan JsonObject
	if l, ok := listenersByNS[nsname]; ok {
		listeners = l
	}
	listeners = append(listeners, lchan)
	listenersByNS[nsname] = listeners
	listenerLock.Unlock()
}

func removeListener(nsname string, lchan chan JsonObject) {
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

func statusWriter(conn *websocket.Conn, updates <-chan JsonObject) {
	log.Debug("websocket statusWriter running")
	for {
		var msg interface{}
		select {
		case u, ok := <-updates:
			if !ok {
				log.Debug("statusWriter terminating")
				return
			}
			msg = u
		case <-time.After(time.Second * 30):
			// send a ping
			break
		}
		if msg != nil {
			if err := conn.WriteJSON(msg); err != nil {
				log.Error("statusWriter WriteJSON error", err, msg)
				break
			}
		}
		msg = fmt.Sprintf("primus::ping::%d", time.Now().Unix())
		if err := conn.WriteJSON(msg); err != nil {
			log.Error("statusWriter WriteJSON error", err, msg)
			break
		}
	}
}

func sendInitialStatus(nsname string, statusChan chan JsonObject) {
	msglist := makeStatusMessages(nsname)
	for _, m := range msglist {
		statusChan <- *m
	}
}

func makeStatusWriter(conn *websocket.Conn) chan JsonObject {
	updateChan := make(chan JsonObject)
	addWsListener(updateChan)
	go statusWriter(conn, updateChan)
	return updateChan
}

func deleteStatusWriter(updatechan chan JsonObject) {
	// channel close will terminate the statusWriter goroutine
	removeWsListener(updatechan)
	close(updatechan)
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Errorf("websocket upgrade error %v\n", err)
		return
	}
	defer conn.Close()

	log.Debug("created websocket connection")
	// Keep track of most recent subscription.  If a subscription is active
	// when websocket closes we could end up closing statusChan without
	// having removed it from listener list
	subscribed := ""
	statusChan := makeStatusWriter(conn)
	defer func() {
		if subscribed != "" {
			log.Warnf("removing listener for '%s' on websocket close", subscribed)
			removeListener(subscribed, statusChan)
		}
		log.Debug("closing statusChan for closed websocket")
		deleteStatusWriter(statusChan)
	}()

	for {
		_, msgbytes, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Warnf("websocket error: %v, user-agent: %v",
					err, r.Header.Get("User-Agent"))
			} else {
				log.Debug("websocket closed")
			}
			break
		}
		var jmsg interface{}
		if err := json.Unmarshal(msgbytes, &jmsg); err != nil {
			log.Errorf("websocket json unmarshal error %v", err)
			continue
		}
		if s, ok := jmsg.(string); ok && strings.HasPrefix(s, "primus::") {
			continue
		} else if jobj, ok := jmsg.(map[string]interface{}); ok {
			action := jobj["msg"].(string)
			switch action {
			case "subscribe":
				nsname := jobj["namespace"].(string)
				log.Debugf("subscribe for ns '%s'", nsname)
				if subscribed != "" {
					log.Warnf(
						"subscription botch.  Prev subscribed '%s', new subscribe '%s'",
						subscribed, nsname)
					removeListener(subscribed, statusChan)
				}
				addListener(nsname, statusChan)
				sendInitialStatus(nsname, statusChan)
				subscribed = nsname
			case "unsubscribe":
				// remove my channel from listeners
				nsname := jobj["namespace"].(string)
				log.Debugf("unsubscribe for ns '%s'", nsname)
				removeListener(nsname, statusChan)
				if subscribed != "" && nsname != subscribed {
					log.Warnf(
						"subscription botch.  Prev subscribed '%s', unsubscribe '%s'",
						subscribed, nsname)
					removeListener(subscribed, statusChan)
				}
				subscribed = ""
			}
		} else {
			log.Errorf("bad/unknown websocket message -- neither string nor obj: %s",
				string(msgbytes))
		}
	}
	log.Debug("websocket handler terminating")
}
