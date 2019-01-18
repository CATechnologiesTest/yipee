package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"

	"k8s.io/helm/pkg/proto/hapi/chart"

	render "github.com/helm/helm/pkg/renderutil"
	log "github.com/sirupsen/logrus"
)

// Create a combined k8s manifest file from a helm chart contained in
// a base64-encoded, gzipped, tar archive; the values file to use for
// instantiating the templates is specified by name.
func Instantiate(chartBytes []byte, valueFileName string) string {
	chart := extractChartData(chartBytes, valueFileName)
	instantiated := renderTemplates(chart)
	return strings.Join(instantiated, "\n---\n")
}

// Create a "chart" object in the format expected by helm's rendering
// code from a bundle.
func extractChartData(chart []byte, valuefileName string) *chart.Chart {
	entries := extractChartFiles(chart)
	templates := findTemplateFiles(entries)
	valueFile := findValueFile(entries, valuefileName)
	return createChart(templates, valueFile)
}

// Create a map of tar file contents keyed by tar entry names after
// decoding and gunzipping
func extractChartFiles(chartData []byte) map[string]string {
	errFunc := func(err error, errstr string) {
		RaiseCatchable(http.StatusBadRequest, errstr,
			log.Fields{"err": "extractChartFiles: " + err.Error()})
	}

	// Base 64 decode
	decoded, err := base64.StdEncoding.DecodeString(string(chartData))
	if err != nil {
		errFunc(err, "can't base64 decode input")
	}

	// Gunzip
	gzipReader, err := gzip.NewReader(bytes.NewBuffer(decoded))
	if err != nil {
		errFunc(err, "can't create gunzip reader for decoded input")
	}
	uncompressed, err := ioutil.ReadAll(gzipReader)
	if err != nil {
		errFunc(err, "can't gunzip decoded input")
	}

	// Untar
	treader := tar.NewReader(bytes.NewBuffer(uncompressed))
	results := make(map[string]string)
	for {
		hdr, err := treader.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			errFunc(err, "error reading tar entry")
		}

		bval, err := ioutil.ReadAll(treader)
		if err != nil {
			errFunc(err, fmt.Sprintf("error reading '%s' tar entry", hdr.Name))
		}
		results[hdr.Name] = string(bval)
	}

	return results
}

func findTemplateFiles(entries map[string]string) map[string]string {
	templateExp, _ := regexp.Compile("^[^/]+/templates/.*$")
	results := make(map[string]string)
	for name, data := range entries {
		if templateExp.MatchString(name) {
			results[name] = data
		}
	}
	return results
}

func findValueFile(entries map[string]string, fileName string) string {
	for name, data := range entries {
		if name == fileName {
			return data
		}
	}

	RaiseCatchable(http.StatusBadRequest, "no matching value file",
		log.Fields{"err": "findValueFile: '" + fileName + "' not found"})
	return "" // notreached
}

// Populate a Chart struct to use as input to helm's template renderer
func createChart(templateData map[string]string, values string) *chart.Chart {
	templates := make([]*chart.Template, 0)

	for name, contents := range templateData {
		templates = append(templates, &chart.Template{
			Name: name, Data: []byte(contents),
		})
	}

	return &chart.Chart{
		Metadata:  &chart.Metadata{Name: "dummy"},
		Templates: templates,
		Values:    &chart.Config{Raw: values}}
}

func renderTemplates(chart *chart.Chart) []string {
	output, err := render.Render(chart, nil, render.Options{})
	if err != nil {
		RaiseCatchable(http.StatusBadRequest, "could not instantiate templates",
			log.Fields{"err": "renderTemplates: '" + err.Error()})
	}
	results := make([]string, 0)
	for _, val := range output {
		results = append(results, val)
	}
	return results
}
