package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

const (
	YIPEE_PREFIX    = "YIPEE_"
	INSTALL_TYPE    = "YIPEE_INSTALL_TYPE"
	STATIC_INSTALL  = "static"
	LIVE_INSTALL    = "cluster"
	DEFAULT_INSTALL = STATIC_INSTALL
	NOT_FOUND       = "config not found"
)

var VALID_INSTALL_TYPES = []string{STATIC_INSTALL, LIVE_INSTALL}

type filter func(string, string) bool

func equalsFilter(entry string, cfg string) bool {
	return entry == cfg
}

func startsWithFilter(entry string, cfg string) bool {
	return strings.HasPrefix(entry, cfg)
}

func initConfigs(router *mux.Router) {
	router.HandleFunc("/configs/{name}", doConfigGet).Methods(http.MethodGet)
	router.HandleFunc("/configs", doYipeeConfigs).Methods(http.MethodGet)
}

func unpack(s []string, vars ...*string) {
	for i, str := range s {
		*vars[i] = str
	}
}

func getEnv(f filter, name string) JsonObject {
	env_obj := make(JsonObject, 0)
	env := os.Environ()
	for _, keyval := range env {
		var k, v string
		unpack(strings.Split(keyval, "="), &k, &v)
		if f(k, name) {
			// add in default install type rather than a bogus value from env
			if k == INSTALL_TYPE && !validInstallValue(v) {
				env_obj[INSTALL_TYPE] = DEFAULT_INSTALL
				continue
			}
			env_obj[k] = v
		}
	}
	return env_obj
}

func validInstallValue(v string) bool {
	for _, a := range VALID_INSTALL_TYPES {
		if v == a {
			return true
		}
	}
	return false
}

func makeConfigResponse(cfg_obj JsonObject, w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write(makeSuccessResponse(cfg_obj))
}

func addDefaultInstallType(cfg_obj *JsonObject) {
	(*cfg_obj)[INSTALL_TYPE] = getFromEnv(INSTALL_TYPE, DEFAULT_INSTALL)
}

// doConfigGet fetches an exact match for the specified ENV name
//
// if the install type is queried for, and no env var was set, it returns
// the default install type (static)
// if the query matches no env variable it returns an HTTP 404 code
func doConfigGet(w http.ResponseWriter, r *http.Request) {
	name := mux.Vars(r)["name"]
	cfg_obj := getEnv(equalsFilter, name)
	if len(cfg_obj) == 0 {
		if name == INSTALL_TYPE {
			addDefaultInstallType(&cfg_obj)
		} else {
			w.WriteHeader(http.StatusNotFound)
			w.Write(makeErrorResponse(NOT_FOUND))
			return
		}
	}
	makeConfigResponse(cfg_obj, w)
}

// doYipeeConfigs fetches any environment variable starting with YIPEE_
//
// If there is no install type found, it adds the default install type (static)
func doYipeeConfigs(w http.ResponseWriter, r *http.Request) {
	cfg_obj := getEnv(startsWithFilter, YIPEE_PREFIX)
	// add in default yipee install type if not found
	if _, ok := cfg_obj[INSTALL_TYPE]; !ok {
		addDefaultInstallType(&cfg_obj)
	}
	makeConfigResponse(cfg_obj, w)
}
