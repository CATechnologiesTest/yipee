package main

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

// diffobj.Data could be one of:
// - flatfile: map[string]interface{}
// - string: if GUID (regex) get from import cache
//           else assume it's a yaml string
type diffobj struct {
	Name string      `json:"name"`
	Data interface{} `json:"data,omitempty"`
	Yaml string      `json:"yaml,omitempty"`
}

type diffinput struct {
	Parent   diffobj    `json:"parent"`
	Children []*diffobj `json:"children"`
}

func initDiffs(router *mux.Router) {
	router.HandleFunc("/diff", doDiff).Methods(http.MethodPost)
}

const guidPat = "^[[:xdigit:]]{8}-[[:xdigit:]]{4}-[[:xdigit:]]{4}-[[:xdigit:]]{4}-[[:xdigit:]]{12}$"

func isGuid(instr string) bool {
	match, err := regexp.MatchString(guidPat, instr)
	if err != nil {
		RaiseCatchable(http.StatusInternalServerError, "guid regex botch",
			log.Fields{"err": err.Error()})
	}
	return match
}

func getDiffData(inobj *diffobj, comp string, errchan chan<- string) {
	if inobj.Name == "" {
		errchan <- fmt.Sprintf("%s: invalid diff input -- name is required", comp)
		return
	}
	if flatobj, ok := inobj.Data.(map[string]interface{}); ok {
		k8sfile, errstr := doConvert("/f2k", marshalJson(flatobj))
		if errstr != "" {
			errchan <- fmt.Sprintf("%s: convert flat to k8s error %s", comp, errstr)
			return
		}
		inobj.Yaml = string(k8sfile)
		inobj.Data = ""
	} else if instr, ok := inobj.Data.(string); ok {
		if isGuid(instr) {
			if cached := importCache.Lookup(instr); cached != nil {
				flatFile := cached.(JsonObject)
				k8sfile, errstr := doConvert("/f2k", marshalJson(flatFile))
				if errstr != "" {
					errchan <- fmt.Sprintf("%s: convert flat to k8s error %s",
						comp, errstr)
					return
				}
				inobj.Yaml = string(k8sfile)
				inobj.Data = ""
			} else {
				errchan <- fmt.Sprintf("%s: No stored import for guid '%s'",
					comp, instr)
				return
			}
		} else {
			// if non-guid string, assume it's an external file ala import
			flatbytes, errstr := tryAllImports(instr)
			if errstr != "" {
				errchan <- fmt.Sprintf("%s: tryAllImports error '%s'",
					comp, errstr)
				return
			}
			k8sfile, errstr := doConvert("/f2k", flatbytes)
			if errstr != "" {
				errchan <- fmt.Sprintf("%s: convert flat to k8s error %s", comp, errstr)
				return
			}
			inobj.Yaml = string(k8sfile)
			inobj.Data = ""
		}
	} else if inobj.Data == nil {
		// assume this is a namespace diff
		nsbytes, errstr := getNamespaceObjects(inobj.Name)
		if errstr != "" {
			errchan <- fmt.Sprintf("%s: diff getNamespaceObjects '%s': %s",
				comp, inobj.Name, errstr)
			return
		}
		inobj.Yaml = string(nsbytes)
		inobj.Data = ""
	} else {
		errchan <- fmt.Sprintf(
			"%s: invalid diff input -- data must be string or object", comp)
		return
	}
	errchan <- ""
}

func getConverterDiffInput(r *http.Request) *diffinput {
	inbytes := readRequestPayload(r)
	diffreq := diffinput{}
	unmarshalJson(inbytes, &diffreq)

	errchan := make(chan string)
	defer close(errchan)
	go getDiffData(&diffreq.Parent, "parent", errchan)
	for i, dobj := range diffreq.Children {
		comp := fmt.Sprintf("child[%d]", i)
		go getDiffData(dobj, comp, errchan)
	}
	var errs []string
	for i := 0; i < len(diffreq.Children)+1; i++ {
		msg := <-errchan
		if msg != "" {
			errs = append(errs, msg)
		}
	}
	errstr := strings.Join(errs, "\n")
	if errstr != "" {
		RaiseCatchable(http.StatusBadRequest,
			"invalid diff input: "+errstr, log.Fields{})
	}
	return &diffreq
}

func doDiff(w http.ResponseWriter, r *http.Request) {
	defer HandleCatchableForRequest(w)
	diffreq := getConverterDiffInput(r)

	// now invoke converter diff
	outbytes, errstr := doConvert("/m2d", marshalJson(diffreq))
	if errstr != "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(makeErrorResponse(errstr))
	} else {
		w.WriteHeader(http.StatusOK)
		w.Write(makeStringResp(true, string(outbytes)))
	}
}
