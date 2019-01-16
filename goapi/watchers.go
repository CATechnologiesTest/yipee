package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	log "github.com/sirupsen/logrus"
	"net/http"
	"sync"
)

type Notification struct {
	Type   string
	Object JsonObject
}

type watchdef struct {
	url  string
	data chan<- Notification
}

var (
	watcherOnce    sync.Once
	watchdog       chan watchdef
	watchUrlByKind = map[string]string{
		"Pod":         "/api/v1/watch/%spods?watch=true",
		"Deployment":  "/apis/apps/v1/watch/%sdeployments?watch=true",
		"ReplicaSet":  "/apis/apps/v1/watch/%sreplicasets?watch=true",
		"StatefulSet": "/apis/apps/v1/watch/%sstatefulsets?watch=true",
		"DaemonSet":   "/apis/apps/v1/watch/%sdaemonsets?watch=true",
	}
)

func initWatchers() {
	watcherOnce.Do(func() {
		k8sInit()
		watchdog = make(chan watchdef)
		go func(c <-chan watchdef) {
			for {
				def := <-c
				go runWatcher(def)
			}
		}(watchdog)
	})
}

func watchAll(result chan Notification, kinds ...string) {
	for _, k := range kinds {
		template, ok := watchUrlByKind[k]
		if !ok {
			log.Errorf("unknown watchAll kind: '%s'", k)
			continue
		}
		url := k8sApiHost + fmt.Sprintf(template, "")
		def := watchdef{url, result}
		watchdog <- def
	}
}

func startWatcher(kind, nsname string) chan Notification {
	template, ok := watchUrlByKind[kind]
	if !ok {
		// xxx: panic
		log.Errorf("unknown startWatcher kind: '%s'", kind)
		return nil
	}
	ns := ""
	if nsname != "" {
		ns = fmt.Sprintf("namespaces/%s/", nsname)
	}
	url := k8sApiHost + fmt.Sprintf(template, ns)
	wchan := make(chan Notification)
	def := watchdef{url, wchan}
	watchdog <- def
	return wchan
}

func runWatcher(def watchdef) {
	log.Debugf("starting watcher %s", def.url)
	req, err := http.NewRequest("GET", def.url, nil)
	if err != nil {
		log.Error("watchRequest error", err)
		return
	}
	req.Header.Add("Authorization", "Bearer "+k8sToken)

	resp, err := k8sWatchClient.Do(req)
	if err != nil {
		log.Error("execute watchRequest error", err)
		return
	}
	defer resp.Body.Close()
	rdr := bufio.NewReader(resp.Body)
	for {
		line, err := rdr.ReadBytes('\n')
		if err != nil {
			log.Errorf("read error on ns watcher '%s': %s\n", def.url, err.Error())
			break
		}
		var notif Notification
		if err := json.Unmarshal(line, &notif); err != nil {
			log.Errorf("JSON unmarshal error on watcher input: %s\n", err.Error())
			break
		}
		def.data <- notif
	}
	watchdog <- def
}
