package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"regexp"
	"testing"
)

type conversion struct {
	path          string
	objkey        string
	expectEntries []string
}

func TestConverts(t *testing.T) {
	cvts := []*conversion{
		&conversion{"/convert/kubernetes", "kubernetesFile", nil},
		&conversion{"/convert/helm", "helmFile", nil},
		&conversion{"/download/kubernetes", "kubernetesFile", nil},
		&conversion{"/download/k8sbundle", "kubernetesFile", []string{}},
		&conversion{"/download/helm", "helmFile",
			[]string{"flatYipee/Chart.yaml", "flatYipee/values.yaml"}},
	}
	flatsrc := "testdata/simple-flat.json"
	f, err := os.Open(flatsrc)
	if err != nil {
		t.Fatalf("can't open %s: %v", flatsrc, err)
	}
	defer f.Close()

	for _, td := range cvts {
		req := httptest.NewRequest(http.MethodPost, td.path, f)
		if _, err := f.Seek(0, 0); err != nil {
			t.Fatalf("can't seek/rewind input file %s: %v", flatsrc, err)
		}
		result := doSuccessRequest(t, req)
		if _, ok := result.Data[0][td.objkey]; !ok {
			t.Errorf("missing key '%s' in return object for %s", td.objkey, td.path)
		}
		payload := result.Data[0][td.objkey].(string)
		if td.expectEntries == nil {
			// not a bundle, so we expect a generated comment
			pat := "^# Generated .+ by Yipee editor\n.+"
			if match, err := regexp.MatchString(pat, payload); !match {
				t.Errorf("expected generated comment for %s: %v", td.path, err)
			}
		} else {
			// expect a base64 encoded, gzipped tarball containing at least
			// the specified entries
			retbytes, err := base64.StdEncoding.DecodeString(payload)
			if err != nil {
				t.Errorf("can't b64 decode bytes for %s: %v", td.path, err)
			}
			gzrdr, err := gzip.NewReader(bytes.NewReader(retbytes))
			if err != nil {
				t.Errorf("gzip reader error for %s: %v", td.path, err)
			}
			trdr := tar.NewReader(gzrdr)
			if err != nil {
				t.Errorf("tar reader error for %s: %v", td.path, err)
			}
			entries := make(map[string]bool)
			for {
				hdr, err := trdr.Next()
				if err != nil {
					if err == io.EOF {
						break
					}
					panic(fmt.Sprintf("tar Next error %v", err))
				}
				entries[hdr.Name] = true
			}
			if len(entries) <= len(td.expectEntries) {
				t.Errorf("insufficient entries for %s -- expected more than %d, got %d",
					td.path, len(td.expectEntries), len(entries))
			}
			for _, e := range td.expectEntries {
				if _, ok := entries[e]; !ok {
					t.Errorf("missing expected entry '%s' for %s", e, td.path)
				}
			}
		}
	}
}
