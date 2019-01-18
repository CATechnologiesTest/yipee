package main

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
)

type catchable struct {
	code      int
	msg       string
	logfields log.Fields
}

func MakeCatchable(code int, msg string, fields log.Fields) *catchable {
	return &catchable{code, msg, fields}
}

func RaiseCatchable(code int, msg string, fields log.Fields) {
	panic(MakeCatchable(code, msg, fields))
}

func HandleCatchableForRequest(w http.ResponseWriter) {
	if r := recover(); r != nil {
		if c, ok := r.(*catchable); ok {
			log.WithFields(c.logfields).Errorf("caught error: %s", c.msg)
			w.WriteHeader(c.code)
			w.Write(makeErrorResponse(c.msg))
		} else {
			fmt.Println("not catchable...")
			panic(r)
		}
	}
}
