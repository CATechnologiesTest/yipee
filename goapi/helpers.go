package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

const DEFAULT_TIMEOUT = time.Second * 30
const CVT_URL = "http://localhost:3000"

var cvtClient = &http.Client{Timeout: DEFAULT_TIMEOUT}

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

func bytesToJsonObject(data []byte) JsonObject {
	var flatFile JsonObject
	if err := json.Unmarshal(data, &flatFile); err != nil {
		log.Errorf("bytesToJsonObject: %v", err)
	}
	return flatFile
}

func toJsonBytes(payload interface{}) []byte {
	outbytes, err := json.Marshal(payload)
	if err != nil {
		log.Errorf("toJsonBytes: %v", err)
	}
	return outbytes
}

func makeStringResp(success bool, payload string) []byte {
	data := make([]string, 1)
	data[0] = payload
	response := &StringResp{success, 1, data}
	return toJsonBytes(response)
}

func makeObjResp(success bool, payload JsonObject) []byte {
	data := make([]JsonObject, 1)
	data[0] = payload
	response := &ObjResp{success, 1, data}
	return toJsonBytes(response)
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
		log.Errorf("kubectl mktemp error %v", err)
		return ""
	}
	defer tmp.Close()
	fname := tmp.Name()
	if _, err = tmp.Write(data); err != nil {
		log.Errorf("kubectl mktemp file write: %v", err)
		os.Remove(fname)
		return ""
	}
	return fname
}
