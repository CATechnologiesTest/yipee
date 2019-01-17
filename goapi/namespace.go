package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"sync"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

var kubectlPath = "/usr/local/bin/kubectl"

func initNamespaces(router *mux.Router) {
	router.HandleFunc("/namespaces/apply/{name}",
		applyNamespace).Methods(http.MethodPost)
	router.HandleFunc("/namespaces/{name}", getNamespace).Methods(http.MethodGet)
	router.HandleFunc("/namespaces/{name}",
		deleteNamespace).Methods(http.MethodDelete)
	router.HandleFunc("/namespaces", getNamespaceList).Methods(http.MethodGet)
}

func getNamespaceObjects(nsname string) ([]byte, string) {
	nsurls := []string{
		fmt.Sprintf("/apis/apps/v1/namespaces/%s/deployments", nsname),
		fmt.Sprintf("/apis/apps/v1/namespaces/%s/statefulsets", nsname),
		fmt.Sprintf("/apis/apps/v1/namespaces/%s/daemonsets", nsname),
		fmt.Sprintf("/api/v1/namespaces/%s/services", nsname),
		fmt.Sprintf("/api/v1/namespaces/%s/persistentvolumeclaims", nsname),
		fmt.Sprintf("/apis/extensions/v1beta1/namespaces/%s/ingresses", nsname),
	}
	resultchan := make(chan []JsonObject)
	for _, u := range nsurls {
		go k8sAsyncGetList(u, resultchan)
	}
	var allobjs bytes.Buffer
	for i := 0; i < len(nsurls); i++ {
		if resp := k8sGetAsyncListResult(resultchan); resp != nil {
			for _, o := range resp {
				allobjs.Write(marshalJson(o))
				allobjs.WriteString("\n---\n")
			}
		} else {
			return nil, "getNamespace timed out"
		}
	}
	close(resultchan)
	return allobjs.Bytes(), ""
}

func getNamespace(w http.ResponseWriter, r *http.Request) {
	nsname := mux.Vars(r)["name"]
	nsBytes, errstr := getNamespaceObjects(nsname)
	if errstr != "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
		return
	}
	flatBytes, errstr := doConvert("/k2f", nsBytes)
	if errstr != "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
		return
	}
	flatObj := bytesToJsonObject(flatBytes)
	if _, ok := flatObj["model-namespace"]; !ok {
		nsobj := make(JsonObject)
		nsobj["type"] = "model-namespace"
		nsobj["name"] = nsname
		flatObj["model-namespace"] = []JsonObject{nsobj}
	}
	result := make(JsonObject)
	result["name"] = nsname
	result["isPrivate"] = true
	result["author"] = "unknown"
	result["flatFile"] = flatObj
	addNameToFlatFile(flatObj, nsname)
	w.WriteHeader(http.StatusOK)
	w.Write(makeSuccessResponse(result))
}

type Nsobj struct {
	Name           string `json:"name"`
	DateCreated    string `json:"dateCreated"`
	Phase          string `json:"phase"`
	PodCount       int    `json:"podCount"`
	ContainerCount int    `json:"containerCount"`
	Status         string `json:"status"`
}

func rollupNamespace(nsobj *Nsobj) {
	podUrl := fmt.Sprintf("/api/v1/namespaces/%s/pods", nsobj.Name)
	podResult := make(chan []JsonObject)
	go k8sAsyncGetList(podUrl, podResult)
	cntlrUrls := []string{
		fmt.Sprintf("/apis/apps/v1/namespaces/%s/deployments", nsobj.Name),
		fmt.Sprintf("/apis/apps/v1/namespaces/%s/statefulsets", nsobj.Name),
		fmt.Sprintf("/apis/apps/v1/namespaces/%s/daemonsets", nsobj.Name),
	}
	cntlrResult := make(chan []JsonObject)
	for _, u := range cntlrUrls {
		go k8sAsyncGetList(u, cntlrResult)
	}

	if pods := k8sGetAsyncListResult(podResult); pods != nil {
		nsobj.PodCount = len(pods)
		ccnt := 0
		for _, pod := range pods {
			spec := pod["spec"].(map[string]interface{})
			containers := spec["containers"].([]interface{})
			ccnt += len(containers)
		}
		nsobj.ContainerCount = ccnt
	}
	var cntlrList []JsonObject
	for i := 0; i < len(cntlrUrls); i++ {
		if cntlrs := k8sGetAsyncListResult(cntlrResult); cntlrs != nil {
			cntlrList = append(cntlrList, cntlrs...)
		} else {
			// xxx: log timeout
			break
		}
	}
	nsobj.Status = "green"
	for _, c := range cntlrList {
		kind := c["kind"].(string)
		status := c["status"].(map[string]interface{})
		spec := c["spec"].(map[string]interface{})
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
		if nsobj.Status != "red" &&
			readyReplicas > 0 && readyReplicas < specReplicas {
			nsobj.Status = "yellow"
		} else if readyReplicas == 0 {
			nsobj.Status = "red"
		}
	}
}

func getNamespaceList(w http.ResponseWriter, r *http.Request) {
	nslist := k8sGetList("/api/v1/namespaces")
	retlist := make([]*Nsobj, len(nslist))
	var wg sync.WaitGroup
	for i, ns := range nslist {
		metadata := ns["metadata"].(map[string]interface{})
		status := ns["status"].(map[string]interface{})
		nsname := metadata["name"].(string)
		nsobj := Nsobj{}
		nsobj.Name = nsname
		nsobj.DateCreated = metadata["creationTimestamp"].(string)
		nsobj.Phase = status["phase"].(string)
		retlist[i] = &nsobj
		wg.Add(1)
		go func(nso *Nsobj) {
			defer wg.Done()
			rollupNamespace(nso)
		}(&nsobj)
	}
	wg.Wait()
	w.WriteHeader(http.StatusOK)
	// XXX: paying the price for straying from []JsonObject return...
	resp := make(map[string]interface{})
	resp["success"] = true
	resp["total"] = len(retlist)
	resp["data"] = retlist
	w.Write(marshalJson(resp))
}

func doKubectlExec(
	w http.ResponseWriter, errfields log.Fields, args ...string) bool {

	_, err := exec.Command(kubectlPath, args...).Output()
	if err != nil {
		stderr := err.Error()
		if exiterr, ok := err.(*exec.ExitError); ok {
			stderr = string(exiterr.Stderr)
		}
		errfields["stderr"] = stderr
		errfields["err"] = err
		errfields["kubectl args"] = args
		log.WithFields(errfields).Errorf("exec error")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(stderr))
		return false
	}
	return true
}

func applyNamespace(w http.ResponseWriter, r *http.Request) {
	defer HandleCatchableForRequest(w)
	reqobj := getInputObject(r)
	flatObj, ok := reqobj["flatFile"].(map[string]interface{})
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse("missing 'flatFile' key"))
	}
	flatBytes := marshalJson(flatObj)

	nsbytes, errstr := doConvert("/f2k", flatBytes)
	if errstr != "" {
		log.WithFields(log.Fields{
			"errstr": errstr,
		}).Errorf("apply/f2k error")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
		return
	}
	tmpname := mkTemp(nsbytes)
	defer os.Remove(tmpname)

	nsname := mux.Vars(r)["name"]
	if hasQueryVal(r, "createNamespace", "true") {
		if !doKubectlExec(w, log.Fields{}, "create", "namespace", nsname) {
			return
		}
	}

	logFields := log.Fields{"tempfile data": string(nsbytes)}
	if !doKubectlExec(w, logFields, "apply", "-f", tmpname) {
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(makeStringResp(true, "applied successfully"))
}

func deleteNamespace(w http.ResponseWriter, r *http.Request) {
	nsname := mux.Vars(r)["name"]
	if !doKubectlExec(w, log.Fields{}, "delete", "namespace", nsname) {
		return
	}
	w.WriteHeader(http.StatusAccepted)
	w.Write(makeStringResp(true, "namespace delete initiated successfully"))
}
