package main

import (
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

var logOnce sync.Once

func initLogger(router *mux.Router) {
	logOnce.Do(func() {
		log.SetLevel(log.DebugLevel)

		// No JSON formatter unless/until we go to some kind of logstash-y approach.
		// Until then, this is easier to read.
		log.SetFormatter(&log.TextFormatter{DisableColors: true})

		router.HandleFunc("/setLog", func(w http.ResponseWriter, r *http.Request) {
			qvals := r.URL.Query()
			level := qvals["level"][0]
			switch level {
			case "debug":
				log.SetLevel(log.DebugLevel)
			case "info":
				log.SetLevel(log.InfoLevel)
			case "warn":
				log.SetLevel(log.WarnLevel)
			case "error":
				log.SetLevel(log.ErrorLevel)
			default:
				// we don't support/use "fatal" and "panic" levels
				log.Warnf("Invalid setting for loglevel: %v", level)
			}
		})
	})
}
