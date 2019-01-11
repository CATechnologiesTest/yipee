package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	// "github.com/davecgh/go-spew/spew"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"net/http"
	"strings"
	"sync"
	"time"
)

var (
	statusOnce sync.Once
	upgrader   *websocket.Upgrader
	watchman   chan watchdef
)

func initStatus(router *mux.Router) {
	router.HandleFunc("/primus", statusHandler).Methods(http.MethodGet)
	statusOnce.Do(func() {
		upgrader = &websocket.Upgrader{
			// ReadBufferSize:  1024,
			// WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}
		watchman = make(chan watchdef)
		go func(c <-chan watchdef) {
			for {
				def := <-c
				go runWatcher(def)
			}
		}(watchman)
	})
}

type watchdef struct {
	nsname string
	data   chan<- JsonObject
}

func statusWriter(conn *websocket.Conn, updates <-chan interface{}) {
	fmt.Println("ws statusWriter running")
	for {
		var msg interface{}
		select {
		case u, ok := <-updates:
			if !ok {
				return
			}
			msg = u
		case <-time.After(time.Second * 10):
			msg = fmt.Sprintf("primus::ping::%d", time.Now().Unix())
		}
		if err := conn.WriteJSON(msg); err != nil {
			fmt.Println("statusWriter WriteJSON error", err, msg)
			break
		}
	}
}

const nsWatchPath = "/apis/apps/v1/watch/namespaces/%s/%s?watch=true"

func runWatcher(def watchdef) {
	nsname := def.nsname
	data := def.data
	fmt.Println("starting watcher", nsname)
	url := k8sApiHost + fmt.Sprintf(nsWatchPath, nsname, "deployments")
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("watchRequest error", err)
		return
	}
	req.Header.Add("Authorization", "Bearer "+k8sToken)

	resp, err := k8sWatchClient.Do(req)
	if err != nil {
		fmt.Println("execute watchRequest error", err)
		return
	}
	defer resp.Body.Close()
	rdr := bufio.NewReader(resp.Body)
	for {
		line, err := rdr.ReadBytes('\n')
		if err != nil {
			fmt.Printf("read error on ns watcher '%s': %s\n", nsname, err.Error())
			break
		}
		var notif notification
		if err := json.Unmarshal(line, &notif); err != nil {
			fmt.Printf("JSON unmarshal error on watcher input: %s\n", err.Error())
			break
		}

		if notif.Type == "ADDED" || notif.Type == "MODIFIED" {
			data <- notif.Object
		} else if notif.Type == "DELETED" {
			fmt.Printf("deleted object in watcher")
		}
	}
	watchman <- def
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
	Update *updatedata `json:"update"`
}

type notification struct {
	Type   string
	Object JsonObject
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

func cgroupForObj(obj JsonObject) {
	// turn obj to flat-format and extract container-group id...

}

func watchns(nsname string, mychan chan string, statchan chan<- interface{}) {
	// setup watcher
	watcher := make(chan JsonObject)
	watchman <- watchdef{nsname, watcher}

	// run until mychan closes.
	// Send update messages to status channel when watcher pops...
	for {
		select {
		case update, ok := <-watcher:
			if !ok {
				fmt.Println("watcher terminated")
				return
			}
			spec := update["spec"].(map[string]interface{})
			status := update["status"].(map[string]interface{})
			active := 0
			if nr, ok := status["readyReplicas"].(float64); ok {
				active = int(nr)
			} else {
				fmt.Println("can't get readyReplicas")
			}
			replicas := 1
			if rep, ok := spec["replicas"].(float64); ok {
				replicas = int(rep)
			} else {
				fmt.Println("can't get replicas")
			}
			udata := &updatedata{
				"deployment-status",
				calculateStatus(replicas, active),
				replicas,
				active,
				0, //xxx
				"need an id"}
			msg := updatemsg{udata}
			statchan <- msg
		case _, ok := <-mychan:
			if !ok {
				fmt.Println("watchns terminating...")
				return
			}
		}
	}
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("ws upgrade error %v\n", err)
		return
	}
	defer conn.Close()

	// XXX: spawn a go routine that uses this connection to send
	// status updates.  Make some thread-safe call to add this channel
	// to all the ones that will get updates...  Add/remove from
	// notify list based on "(un)subscribe" requests...
	statusChan := make(chan interface{})
	var nslistener chan string
	go statusWriter(conn, statusChan)
	for {
		_, msgbytes, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				fmt.Printf("error: %v, user-agent: %v", err, r.Header.Get("User-Agent"))
			}
			return
		}
		var jmsg interface{}
		if err := json.Unmarshal(msgbytes, &jmsg); err != nil {
			fmt.Println("json unmarshal error", err)
			continue
		}
		if s, ok := jmsg.(string); ok && strings.HasPrefix(s, "primus::") {
			// fmt.Printf("ignoring primus message '%s'\n", s)
			continue
		} else if jobj, ok := jmsg.(map[string]interface{}); ok {
			action := jobj["msg"].(string)
			switch action {
			case "subscribe":
				// add my channel to listeners
				fmt.Println("subscribe for ns", jobj["namespace"])
				nsname := jobj["namespace"].(string)
				nslistener = make(chan string)
				go watchns(nsname, nslistener, statusChan)
			case "unsubscribe":
				// remove my channel from listeners
				fmt.Println("unsubscribe for ns", jobj["namespace"])
				if nslistener != nil {
					close(nslistener)
				}
				nslistener = nil
			}
		} else {
			fmt.Println("bad/unknown message -- neither string nor obj",
				string(msgbytes))
		}
	}
}
