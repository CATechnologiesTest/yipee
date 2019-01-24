package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	log "github.com/sirupsen/logrus"
)

const DEFAULT_TIMEOUT = time.Second * 30

var (
	CVT_URL   = getFromEnv("CVT_URL", "http://localhost:3000")
	cvtClient = &http.Client{Timeout: DEFAULT_TIMEOUT}
)

type JsonObject map[string]interface{}

type StringResp struct {
	Success bool     `json:"success"`
	Total   int      `json:"total"`
	Data    []string `json:"data"`
}

type ObjResp struct {
	Success bool         `json:"success"`
	Total   int          `json:"total"`
	Data    []JsonObject `json:"data"`
}

func unmarshalJson(data []byte, target interface{}) {
	if err := json.Unmarshal(data, target); err != nil {
		RaiseCatchable(http.StatusBadRequest, "can't unmarshal JSON",
			log.Fields{"err": "unmarshalJson: " + err.Error()})
	}
}

func marshalJson(payload interface{}) []byte {
	outbytes, err := json.Marshal(payload)
	if err != nil {
		RaiseCatchable(http.StatusBadRequest, "can't marshal JSON",
			log.Fields{"err": "marshalJson: " + err.Error()})
	}
	return outbytes
}

func readRequestPayload(r *http.Request) []byte {
	inbytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		RaiseCatchable(http.StatusBadRequest, "can't read request body",
			log.Fields{"err": "getInputObject: " + err.Error()})
	}
	return inbytes
}

func getInputObject(r *http.Request) JsonObject {
	inbytes := readRequestPayload(r)
	return bytesToJsonObject(inbytes)
}

func bytesToJsonObject(data []byte) JsonObject {
	var flatFile JsonObject
	unmarshalJson(data, &flatFile)
	return flatFile
}

func makeStringResp(success bool, payload string) []byte {
	data := make([]string, 1)
	data[0] = payload
	response := &StringResp{success, 1, data}
	return marshalJson(response)
}

func makeObjResp(success bool, payload JsonObject) []byte {
	data := make([]JsonObject, 1)
	data[0] = payload
	response := &ObjResp{success, 1, data}
	return marshalJson(response)
}

func makeErrorResponse(payload string) []byte {
	return makeStringResp(false, payload)
}

func makeSuccessResponse(payload JsonObject) []byte {
	return makeObjResp(true, payload)
}

func doConvert(path string, data []byte) (payload []byte, errstr string) {
	var req *http.Request
	var resp *http.Response
	var err error
	var resbody []byte

	req, err = http.NewRequest("POST", CVT_URL+path, bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Sprintf("http.NewRequest error: %s", err.Error())
	}
	req.Header.Add("Content-Type", "text/plain")

	resp, err = cvtClient.Do(req)
	if err != nil {
		return nil, err.Error()
	}
	resbody, err = ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		return nil, fmt.Sprintf("body read error: %s", err.Error())
	}
	if resp.StatusCode >= 300 {
		return nil, string(resbody)
	}
	return resbody, ""
}

type CvtResult struct {
	converted []byte
	error     string
}

func doAsyncConvert(path string, data []byte, result chan<- CvtResult) {
	payload, errstr := doConvert(path, data)
	result <- CvtResult{payload, errstr}
}

func hasQueryVal(r *http.Request, name string, val string) bool {
	qvals := r.URL.Query()
	if qv, ok := qvals[name]; ok {
		return len(qv) > 0 && qv[0] == val
	}
	return false
}

func mkTemp(data []byte) string {
	tmp, err := ioutil.TempFile("", "yipee-kubectl-*.yml")
	if err != nil {
		RaiseCatchable(http.StatusInternalServerError,
			"mktemp error", log.Fields{"err": err.Error()})
	}
	defer tmp.Close()
	fname := tmp.Name()
	if _, err = tmp.Write(data); err != nil {
		os.Remove(fname)
		RaiseCatchable(http.StatusInternalServerError,
			"mktemp file write error", log.Fields{"err": err.Error()})
	}
	return fname
}
