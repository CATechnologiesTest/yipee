package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"

	yaml "gopkg.in/yaml.v2"

	"k8s.io/helm/pkg/proto/hapi/chart"

	render "github.com/helm/helm/pkg/renderutil"
	log "github.com/sirupsen/logrus"
)

// Create a combined k8s manifest file from a helm chart contained in
// a base64-encoded, gzipped, tar archive; the values file to use for
// instantiating the templates is specified by name.
func Instantiate(chartBytes []byte, valueFileName string) (string, string) {
	name, chart := extractChartData(chartBytes, valueFileName)
	instantiated := renderTemplates(chart)
	return name, strings.Join(instantiated, "\n---\n")
}

// Create a "chart" object in the format expected by helm's rendering
// code from a bundle.
func extractChartData(chart []byte, valuefileName string) (string, *chart.Chart) {
	entries := extractChartFiles(chart)
	name := getChartName(entries)
	templates := findTemplateFiles(entries)
	valueFile := findValuesFile(entries, valuefileName)
	return name, createChart(templates, valueFile)
}

func makeFailureFunc(activityName string) func(error, ...string) {
	return func(err error, errstrs ...string) {
		var outstr string
		if len(errstrs) > 0 {
			outstr = strings.Join(errstrs, "")
		} else {
			outstr = err.Error()
		}
		RaiseCatchable(http.StatusBadRequest, outstr,
			log.Fields{"err": activityName + ": " + err.Error()})
	}
}

// Create a map of tar file contents keyed by tar entry names after
// decoding and gunzipping
func extractChartFiles(chartData []byte) map[string]string {
	failRequest := makeFailureFunc("extractChartFiles")

	// Base 64 decode
	decoded, err := base64.StdEncoding.DecodeString(string(chartData))
	if err != nil {
		failRequest(err, "can't base64 decode input")
	}
	// Gunzip
	gzipReader, err := gzip.NewReader(bytes.NewBuffer(decoded))
	if err != nil {
		failRequest(err, "can't create gunzip reader for decoded input")
	}
	defer gzipReader.Close()
	uncompressed, err := ioutil.ReadAll(gzipReader)
	if err != nil {
		failRequest(err, "can't gunzip decoded input")
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
			failRequest(err, "error reading tar file")
		}

		bval, err := ioutil.ReadAll(treader)
		if err != nil {
			failRequest(err, fmt.Sprintf("error reading '%s' tar entry", hdr.Name))
		}
		results[hdr.Name] = string(bval)
	}

	return results
}

// Retrieve the name of a chart from the Chart.yaml file
type chartName struct {
	Name string `yaml: "name"`
}

func getChartName(entries map[string]string) string {
	chartExp, _ := regexp.Compile("^[^/]+/Chart.yaml$")
	failRequest := makeFailureFunc("getChartName")

	for name, data := range entries {
		if chartExp.MatchString(name) {
			var cname chartName
			err := yaml.Unmarshal([]byte(data), &cname)
			if err != nil {
				failRequest(err, "can't unmarshal Chart.yaml")
			}
			return cname.Name
		}
	}

	failRequest(errors.New("Chart.yaml not found"))
	return "" // notreached
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

func findValuesFile(entries map[string]string, fileName string) string {
	failRequest := makeFailureFunc("findValuesFile")

	for name, data := range entries {
		slashidx := strings.Index(name, "/")
		if slashidx != -1 && name[slashidx+1:] == fileName {
			return data
		}
	}

	failRequest(errors.New("values file: '" + fileName + "' not found"))
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
	failRequest := makeFailureFunc("renderTemplates")
	output, err := render.Render(chart, nil, render.Options{})
	if err != nil {
		failRequest(err, "could not instantiate templates")
	}
	results := make([]string, 0)
	for _, val := range output {
		results = append(results, val)
	}
	return results
}
