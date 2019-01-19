package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func testRequest(t *testing.T, req *http.Request, payload interface{}) int {
	recorder := httptest.NewRecorder()
	Router().ServeHTTP(recorder, req)
	if recorder.Code == 405 {
		return recorder.Code
	}
	err := json.Unmarshal(recorder.Body.Bytes(), payload)
	if err != nil && recorder.Code != 404 { // 404 response can be just a string
		t.Errorf("%v %v - json unmarshal: %v, Response code: %v", req.Method, req.URL, err, recorder.Code)
	}
	return recorder.Code
}

func doSuccessRequest(t *testing.T, req *http.Request) *ObjResp {
	var result ObjResp
	status := testRequest(t, req, &result)

	if status != 200 || !result.Success {
		t.Error("unexpected response code or success flag", req.URL, status, result.Success)
	}
	return &result
}

func doSuccessRequestString(t *testing.T, req *http.Request) *StringResp {
	var result StringResp
	status := testRequest(t, req, &result)

	if status > 299 || !result.Success {
		t.Error("unexpected response code or success flag", req.URL, status, result.Success)
	}
	return &result
}

func doErrRequest(t *testing.T, req *http.Request) *StringResp {
	var result StringResp
	status := testRequest(t, req, &result)
	if status < 400 || result.Success {
		t.Error("unexpected error response code or flag", req.URL, status, result.Success)
	}
	return &result
}

func NewK8sTestServer() *httptest.Server {
	router := mux.NewRouter()
	router.HandleFunc("/api/v1/namespaces",
		getTestList("namespaceList.json")).Methods(http.MethodGet)
	router.HandleFunc("/apis/apps/v1/namespaces/{nsname}/deployments",
		getTestList("deploymentList.json")).Methods(http.MethodGet)
	router.HandleFunc("/apis/apps/v1/namespaces/{nsname}/statefulsets",
		getTestList("statefulSetList.json")).Methods(http.MethodGet)
	router.HandleFunc("/apis/apps/v1/namespaces/{nsname}/daemonsets",
		getTestList("daemonSetList.json")).Methods(http.MethodGet)
	router.HandleFunc("/api/v1/namespaces/{nsname}/services",
		getTestList("serviceList.json")).Methods(http.MethodGet)
	router.HandleFunc("/api/v1/namespaces/{nsname}/persistentvolumeclaims",
		getTestList("pvcList.json")).Methods(http.MethodGet)
	router.HandleFunc("/apis/extensions/v1beta1/namespaces/{nsname}/ingresses",
		getTestList("ingressList.json")).Methods(http.MethodGet)
	router.HandleFunc("/api/v1/namespaces/{nsname}/pods",
		getTestList("podList.json")).Methods(http.MethodGet)
	svr := httptest.NewServer(router)
	setTestK8sApiHost(svr.URL)
	return svr
}

func readTestData(fname string) []byte {
	qname := fmt.Sprintf("testdata/%s", fname)
	f, err := os.Open(qname)
	if err != nil {
		panic(fmt.Sprintf("Can't open %s: %v", qname, err))
	}
	defer f.Close()
	data, err := ioutil.ReadAll(f)
	if err != nil {
		panic(fmt.Sprintf("Can't read %s: %v", qname, err))
	}
	return data
}

func getTestList(fname string) func(http.ResponseWriter, *http.Request) {
	data := readTestData(fname)
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	}
}
