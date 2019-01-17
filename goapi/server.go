package main

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"sync"
)

var (
	router *mux.Router
	once   sync.Once
)

func Router() *mux.Router {
	once.Do(func() {
		router = mux.NewRouter()
		initLogger(router)
		initImports(router)
		initConverts(router)
		initNamespaces(router)
		initStatus(router)
		initDiffs(router)
	})
	return router
}

func main() {
	if err := http.ListenAndServe(":5000", Router()); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
