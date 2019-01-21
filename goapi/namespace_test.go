package main

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)
func TestNamespace4XXMethods(t *testing.T) {
	var tests = []struct {
		url string
		method string
		expected int
	} {
		{"/namespaces", http.MethodPut, 405},
		{"/namespaces", http.MethodPost, 405},
		{"/namespaces", http.MethodDelete, 405},
		{"/namespaces/foo", http.MethodPut, 405},
		{"/namespaces/foo", http.MethodPost, 405},
		{"/namespaces/foo/apply", http.MethodGet, 405},
		{"/namespaces/foo/apply", http.MethodPut, 405},
		{"/namespaces/foo/apply", http.MethodDelete, 405},
		{"/namespaces/apply/foo/bar", http.MethodGet, 404},
		{"/namespaces/fake/apply/foo", http.MethodPost, 404},
		{"/namespaces/fake/apply/foo?createNamespace=true", http.MethodPost, 404},

	}
	for _, test := range tests {
		expectStatusCode(t, httptest.NewRequest(test.method, test.url, nil), test.expected); 
	}
}
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
			"/namespaces/fake/apply",
			bytes.NewBuffer(applyBytes)))
	doSuccessRequestString(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/fake/apply?createNamespace=true",
			bytes.NewBuffer(applyBytes)))
	doSuccessRequestString(t,
		httptest.NewRequest(http.MethodDelete, "/namespaces/fake", nil))
	// getting data for a namespace named apply should work
	doSuccessRequestString(t,
		httptest.NewRequest(http.MethodDelete, "/namespaces/apply", nil))

		// fail post without data
	doErrRequest(t,
		httptest.NewRequest(http.MethodPost, "/namespaces/foo/apply", nil))	
	
	kubectlPath = "/none/ya"
	doErrRequest(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/fake/apply",
			bytes.NewBuffer(applyBytes)))
	doErrRequest(t,
		httptest.NewRequest(http.MethodPost,
			"/namespaces/fake/apply?createNamespace=true",
			bytes.NewBuffer(applyBytes)))

}
