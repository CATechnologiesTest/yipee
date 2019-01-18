package main

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"sync"
	"time"

	log "github.com/sirupsen/logrus"
)

const liveApiHost = "https://kubernetes.default.svc"
const secretDir = "/var/run/secrets/kubernetes.io/serviceaccount/"

var k8sApiHost = liveApiHost

// "static" vars
var (
	k8sClient      *http.Client
	k8sWatchClient *http.Client
	k8sToken       string
	k8sonce        sync.Once
)

func readSecret(name string) []byte {
	var sbytes []byte
	var err error

	if getFromEnv(INSTALL_TYPE, STATIC_INSTALL) == LIVE_INSTALL {
		sbytes, err = ioutil.ReadFile(secretDir + name)
		if err != nil {
			log.WithFields(log.Fields{
				"err":         err,
				"secretDir":   secretDir,
				"secret name": name,
			}).Error("read k8s secret error")
			return nil
		}
	}
	return sbytes
}

func setTestK8sApiHost(path string) {
	k8sApiHost = path
}

// initialize statics
func k8sInit() {
	k8sonce.Do(func() {
		ktrans := &http.Transport{}
		if crtbytes := readSecret("ca.crt"); crtbytes != nil {
			roots := x509.NewCertPool()
			roots.AppendCertsFromPEM(crtbytes)
			ktls := &tls.Config{}
			ktls.RootCAs = roots
			ktrans = &http.Transport{TLSClientConfig: ktls}
		}
		k8sClient = &http.Client{Transport: ktrans, Timeout: DEFAULT_TIMEOUT}
		k8sWatchClient = &http.Client{Transport: ktrans} // no timeout
		k8sToken = ""
		if tokbytes := readSecret("token"); tokbytes != nil {
			k8sToken = string(tokbytes)
		}
	})
}

// The fields we care about in a List response from the k8s API.
// We parse JSON data from the API directly into this struct, with
// the JSON parser dropping fields that aren't mentioned here.
// This also allows us to traffic in JsonObjects without quite as
// much type-assertion
type k8slist struct {
	Kind       string       `json:"kind"`
	ApiVersion string       `json:"apiVersion"`
	Items      []JsonObject `json:"items"`
}

func k8sGetList(path string) []JsonObject {
	k8sInit()
	req, err := http.NewRequest(http.MethodGet, k8sApiHost+path, nil)
	if err != nil {
		log.WithFields(log.Fields{
			"err":  err,
			"path": path,
		}).Error("k8sGetList request create failure")
		return nil
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", k8sToken))
	resp, err := k8sClient.Do(req)
	if err != nil {
		log.WithFields(log.Fields{
			"err":  err,
			"path": path,
		}).Error("k8sGetList request execute failure")
		return nil
	}
	body, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		log.WithFields(log.Fields{
			"err":  err,
			"path": path,
		}).Error("k8sGetList read response body failure")
		return nil
	}
	if resp.StatusCode >= 300 {
		log.WithFields(log.Fields{
			"code": resp.StatusCode,
			"path": path,
		}).Error("k8sGetList non-success status")
		return nil
	}
	var retobj k8slist
	if err := json.Unmarshal(body, &retobj); err != nil {
		log.WithFields(log.Fields{
			"err":       err,
			"path":      path,
			"body data": string(body),
		}).Error("k8sGetList json unmarshal")
		return nil
	}
	kindstr := strings.TrimSuffix(retobj.Kind, "List")
	for _, o := range retobj.Items {
		o["apiVersion"] = retobj.ApiVersion
		o["kind"] = kindstr
	}

	return retobj.Items
}

func k8sAsyncGetList(path string, result chan<- []JsonObject) {
	result <- k8sGetList(path)
}

func k8sGetAsyncListResult(reschan chan []JsonObject) []JsonObject {
	select {
	case resp := <-reschan:
		return resp
	case <-time.After(time.Second * 5):
		return nil
	}
}
