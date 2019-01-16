package main

import (
	"bytes"
	"fmt"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"sync"
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
				allobjs.Write(toJsonBytes(o))
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

func getExecErrorMsg(err error) string {
	msg := err.Error()
	if exiterr, ok := err.(*exec.ExitError); ok {
		msg = string(exiterr.Stderr)
	}
	return msg
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
	w.Write(toJsonBytes(resp))
}

func getFlatBytesFromPayload(w http.ResponseWriter, r *http.Request) []byte {
	inbytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(makeErrorResponse("can't read input"))
		return nil
	}
	reqobj := bytesToJsonObject(inbytes)
	if reqobj == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse("can't parse input json"))
		return nil
	}
	flatObj, ok := reqobj["flatFile"].(map[string]interface{})
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse("missing flatFile key"))
		return nil
	}
	flatBytes := toJsonBytes(flatObj)
	if flatBytes == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse("invalid json for apply"))
		return nil
	}
	return flatBytes
}

func applyNamespace(w http.ResponseWriter, r *http.Request) {
	flatBytes := getFlatBytesFromPayload(w, r)
	if flatBytes == nil {
		return
	}

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
	if tmpname == "" {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(makeErrorResponse("error writing tempfile for apply"))
		return
	}
	defer os.Remove(tmpname)

	nsname := mux.Vars(r)["name"]
	if hasQueryVal(r, "createNamespace", "true") {
		_, err := exec.Command(kubectlPath, "create", "namespace", nsname).Output()
		if err != nil {
			errstr := getExecErrorMsg(err)
			log.WithFields(log.Fields{
				"nsname": nsname,
				"stderr": errstr,
				"err":    err.Error(),
			}).Error("create ns error")
			w.WriteHeader(http.StatusBadRequest)
			w.Write(makeErrorResponse(errstr))
			return
		}
	}

	_, err := exec.Command(kubectlPath, "apply", "-f", tmpname).Output()
	if err != nil {
		errstr := getExecErrorMsg(err)
		log.WithFields(log.Fields{
			"data":   string(nsbytes),
			"stderr": errstr,
			"err":    err.Error(),
		}).Error("apply error")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(makeStringResp(true, "applied successfully"))
}

func deleteNamespace(w http.ResponseWriter, r *http.Request) {
	nsname := mux.Vars(r)["name"]
	_, err := exec.Command(kubectlPath, "delete", "namespace", nsname).Output()
	if err != nil {
		errstr := getExecErrorMsg(err)
		log.WithFields(log.Fields{
			"nsname": nsname,
			"stderr": errstr,
			"err":    err.Error(),
		}).Error("delete namespace error")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
		return
	}
	w.WriteHeader(http.StatusAccepted)
	w.Write(makeStringResp(true, "namespace delete initiated successfully"))
}
