package main

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNamespace(t *testing.T) {
	svr := NewK8sTestServer()
	defer svr.Close()

	// No assertions given that the canned namespace data is pretty bogus.
	// This exercises the namespace.go code though.
	doSuccessRequest(t,
		httptest.NewRequest(http.MethodGet, "/namespaces", nil))
	// nsname is irrelevant with canned k8s api testdata
	doSuccessRequest(t,
		httptest.NewRequest(http.MethodGet, "/namespaces/fake", nil))

	flatsrc := "testdata/simple-flat.json"
	flatBytes, err := ioutil.ReadFile(flatsrc)
	if err != nil {
		t.Fatalf("can't read %s: %v", flatsrc, err)
	}
	applyObj := make(JsonObject)
	flatobj := bytesToJsonObject(flatBytes)
	applyObj["flatFile"] = flatobj
	applyBytes := toJsonBytes(applyObj)

	kubectlPath = "/bin/echo"
	doSuccessRequestString(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/apply/fake",
			bytes.NewBuffer(applyBytes)))
	doSuccessRequestString(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/apply/fake?createNamespace=true",
			bytes.NewBuffer(applyBytes)))
	doSuccessRequestString(t,
		httptest.NewRequest(http.MethodDelete, "/namespaces/fake", nil))

	kubectlPath = "/none/ya"
	doErrRequest(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/apply/fake",
			bytes.NewBuffer(applyBytes)))
	doErrRequest(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/apply/fake?createNamespace=true",
			bytes.NewBuffer(applyBytes)))
	doErrRequest(t,
		httptest.NewRequest(http.MethodDelete, "/namespaces/fake", nil))
}
