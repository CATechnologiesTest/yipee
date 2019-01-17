package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func buildDiffTestInput(
	parentName string,
	parentData interface{},
	childName string,
	childData interface{}) *bytes.Buffer {

	pobj := make(JsonObject)
	pobj["name"] = parentName
	pobj["data"] = parentData

	cobj := make(JsonObject)
	cobj["name"] = childName
	cobj["data"] = childData

	input := make(JsonObject)
	input["parent"] = pobj
	input["children"] = []JsonObject{cobj}

	return bytes.NewBuffer(marshalJson(input))
}

func printResult(tname string, resp *StringResp) {
	fmt.Printf("--- %s ---\n", tname)
	fmt.Println(resp.Data[0])
	fmt.Printf("--- end %s ---\n", tname)
}

func testInvalids(t *testing.T) {
	// input object doesn't have the right keys
	badobj := make(JsonObject)
	badobj["foo"] = 10
	badobj["bar"] = false
	badobjbuf := bytes.NewBuffer(marshalJson(badobj))
	req := httptest.NewRequest(http.MethodPost, "/diff", badobjbuf)
	doErrRequest(t, req)

	// input object without a name
	nameless := buildDiffTestInput("", nil, "", nil)
	req = httptest.NewRequest(http.MethodPost, "/diff", nameless)
	doErrRequest(t, req)

	// input object with bad data
	badChildBuf := buildDiffTestInput("parent", nil, "child", 10)
	req = httptest.NewRequest(http.MethodPost, "/diff", badChildBuf)
	doErrRequest(t, req)

	// input object with non-convertible payload
	badYaml := buildDiffTestInput("parent", nil, "child", badobj)
	req = httptest.NewRequest(http.MethodPost, "/diff", badYaml)
	doErrRequest(t, req)

	// input with non-cached buid
	badGuid := buildDiffTestInput("parent", nil,
		"child", "ffffffff-ffff-ffff-ffff-ffffffffffff")
	req = httptest.NewRequest(http.MethodPost, "/diff", badGuid)
	doErrRequest(t, req)
}

func testNamespaces(t *testing.T) {
	inbuf := buildDiffTestInput("parent", nil, "child", nil)
	req := httptest.NewRequest(http.MethodPost, "/diff", inbuf)
	doSuccessRequestString(t, req)
}

func testFlatInput(t *testing.T) {
	flatbytes := readTestData("simple-flat.json")
	flatobj := bytesToJsonObject(flatbytes)
	inbuf := buildDiffTestInput("parent", nil, "child", flatobj)
	req := httptest.NewRequest(http.MethodPost, "/diff", inbuf)
	doSuccessRequestString(t, req)
}

func testTar(t *testing.T) {
	tarbytes := readTestData("bday.tgz")
	tarstr := base64.StdEncoding.EncodeToString(tarbytes)
	inbuf := buildDiffTestInput("parent", tarstr, "child", tarstr)
	req := httptest.NewRequest(http.MethodPost, "/diff", inbuf)
	doSuccessRequestString(t, req)

	yamlbytes := readTestData("bday4.yml")
	yamlstr := base64.StdEncoding.EncodeToString(yamlbytes)
	inbuf = buildDiffTestInput("parent", tarstr, "child", yamlstr)
	req = httptest.NewRequest(http.MethodPost, "/diff", inbuf)
	doSuccessRequestString(t, req)

}

func testCache(t *testing.T) {
	req := makeImportRequest(t, "bday4.yml", "diff-test", true)
	impresult := doSuccessRequest(t, req)
	guid := impresult.Data[0]["guid"].(string)

	inbuf := buildDiffTestInput("parent", nil, "child", guid)
	req = httptest.NewRequest(http.MethodPost, "/diff", inbuf)
	doSuccessRequestString(t, req)
}

func TestDiffs(t *testing.T) {
	svr := NewK8sTestServer()
	defer svr.Close()

	testInvalids(t)
	testNamespaces(t)
	testFlatInput(t)
	testTar(t)
	testCache(t)
}
