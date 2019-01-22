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
	"regexp"
	"strings"

	yaml "gopkg.in/yaml.v2"

	"k8s.io/helm/pkg/proto/hapi/chart"

	render "github.com/helm/helm/pkg/renderutil"
	log "github.com/sirupsen/logrus"
)

type badhelm struct {
	err error
	msg string
}

func helmerror(err error, msgs ...string) {
	errmsg := ""
	if len(msgs) > 0 {
		errmsg = strings.Join(msgs, "")
	}
	panic(badhelm{err, errmsg})
}

// If the argument is a helm chart, create a combined k8s manifest
// file from the contents.
func helmInstantiate(
	chartString string,
	logerror ...bool) (bool, string, string) {
	// Handle any failures in unpacking and instantiating a helm file
	isHelm := false
	name := ""
	instantiated := ""
	handler([]byte(chartString), logerror, &isHelm, &name, &instantiated)
	return isHelm, name, instantiated
}

func handler(
	chartBytes []byte,
	logerror []bool,
	isHelm *bool,
	name, instantiated *string) {
	defer func() {
		val := recover()
		if errval, ok := val.(badhelm); ok {
			if len(logerror) > 0 && logerror[0] {
				log.Errorf("%s: %s", errval.msg, errval.err)
			}
		}
	}()
	nameval, chartval, values := extractChartData(chartBytes)
	instTemplates := renderTemplates(chartval, &chart.Config{Raw: values})
	*isHelm = true
	*name = nameval
	*instantiated = strings.Join(instTemplates, "\n---\n")
}

// Create a "chart" object in the format expected by helm's rendering
// code from a bundle.
func extractChartData(chart []byte) (string, *chart.Chart, string) {
	entries := extractChartFiles(chart)
	name := getChartName(entries)
	templates := findTemplateFiles(entries)
	fmt.Printf("T: %v\n", templates)
	valueFile := findValuesFile(entries)
	return name, createChart(name, templates), valueFile
}

// Create a map of tar file contents keyed by tar entry names after
// decoding and gunzipping
func extractChartFiles(chartData []byte) map[string]string {
	// Base 64 decode
	decoded, err := base64.StdEncoding.DecodeString(string(chartData))
	if err != nil {
		helmerror(err, "can't base64 decode input")
	}
	// Gunzip
	gzipReader, err := gzip.NewReader(bytes.NewBuffer(decoded))
	if err != nil {
		helmerror(err, "can't create gunzip reader for decoded input")
	}
	defer gzipReader.Close()
	uncompressed, err := ioutil.ReadAll(gzipReader)
	if err != nil {
		helmerror(err, "can't gunzip decoded input")
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
			helmerror(err, "error reading tar file")
		}

		bval, err := ioutil.ReadAll(treader)
		if err != nil {
			helmerror(err, fmt.Sprintf("error reading '%s' tar entry",
				hdr.Name))
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

	for name, data := range entries {
		if chartExp.MatchString(name) {
			var cname chartName
			err := yaml.Unmarshal([]byte(data), &cname)
			if err != nil {
				helmerror(err, "can't unmarshal Chart.yaml")
			}
			return cname.Name
		}
	}

	helmerror(errors.New("Chart.yaml not found"))
	return "" // notreached
}

func findTemplateFiles(entries map[string]string) map[string]string {
	templateExp, _ := regexp.Compile("^[^/]+/templates/.+$")
	results := make(map[string]string)
	for name, data := range entries {
		if templateExp.MatchString(name) {
			results[name] = data
		}
	}
	return results
}

func findValuesFile(entries map[string]string) string {
	for name, data := range entries {
		slashidx := strings.Index(name, "/")
		if slashidx != -1 && name[slashidx+1:] == "Values.yaml" {
			return data
		}
	}

	helmerror(errors.New("values file not found"))
	return "" // notreached
}

// Populate a Chart struct to use as input to helm's template renderer
func createChart(name string, templateData map[string]string) *chart.Chart {
	templates := make([]*chart.Template, 0)

	for name, contents := range templateData {
		templates = append(templates, &chart.Template{
			Name: name, Data: []byte(contents),
		})
	}

	return &chart.Chart{
		Metadata:  &chart.Metadata{Name: name},
		Templates: templates,
		Values:    &chart.Config{}}
}

func renderTemplates(chart *chart.Chart, vals *chart.Config) []string {
	output, err := render.Render(chart, vals, render.Options{})
	if err != nil {
		helmerror(err, "could not instantiate templates")
	}
	results := make([]string, 0)
	for _, val := range output {
		results = append(results, val)
	}
	return results
}
