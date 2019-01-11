package main

import (
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
}
