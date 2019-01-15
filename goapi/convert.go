package main

import (
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"time"
)

func initConverts(router *mux.Router) {
	router.HandleFunc("/convert/kubernetes", cvtFlatToK8s).Methods(http.MethodPost)
	router.HandleFunc("/convert/helm", cvtFlatToHelmNerd).Methods(http.MethodPost)
	router.HandleFunc("/download/kubernetes", downloadK8s).Methods(http.MethodPost)
	router.HandleFunc(
		"/download/k8sbundle", downloadK8sBundle).Methods(http.MethodPost)
	router.HandleFunc("/download/helm", downloadHelm).Methods(http.MethodPost)
}

type cvtparams struct {
	path        string
	tag         string
	withComment bool
}

func cvtFlatToK8s(w http.ResponseWriter, r *http.Request) {
	p := &cvtparams{"/f2k", "kubernetesFile", true}
	apiConvert(p, w, r)
}

func cvtFlatToHelmNerd(w http.ResponseWriter, r *http.Request) {
	p := &cvtparams{"/f2hnerd", "helmFile", true}
	apiConvert(p, w, r)
}

func downloadK8s(w http.ResponseWriter, r *http.Request) {
	p := &cvtparams{"/f2k", "kubernetesFile", true}
	apiConvert(p, w, r)
}

func downloadK8sBundle(w http.ResponseWriter, r *http.Request) {
	p := &cvtparams{"/f2kbundle", "kubernetesFile", false}
	apiConvert(p, w, r)
}

func downloadHelm(w http.ResponseWriter, r *http.Request) {
	p := &cvtparams{"/f2hbundle", "helmFile", false}
	apiConvert(p, w, r)
}

func apiConvert(p *cvtparams, w http.ResponseWriter, r *http.Request) {

	inbytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(makeErrorResponse("can't read input"))
		return
	}
	nowstr := time.Now().UTC().String()
	flatFile := bytesToJsonObject(inbytes)
	addAnnotationInfoToFlatFile(flatFile, nowstr)

	payload, errstr := doConvert(p.path, toJsonBytes(flatFile))
	if errstr != "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
	} else {
		w.WriteHeader(http.StatusOK)
		retobj := make(JsonObject)
		if p.withComment {
			retobj[p.tag] = downloadComment(nowstr) + string(payload)
		} else {
			retobj[p.tag] = string(payload)
		}
		w.Write(makeSuccessResponse(retobj))
	}
}

func addAnnotationInfoToFlatFile(flatFile JsonObject, tstr string) {
	anno := make(JsonObject)
	anno["type"] = "model-annotations"
	anno["yipee.generatedAt"] = tstr
	list := make([]JsonObject, 1)
	list[0] = anno
	flatFile["model-annotations"] = list
}

func downloadComment(tstr string) string {
	return "# Generated " + tstr + " by Yipee editor\n"
}
