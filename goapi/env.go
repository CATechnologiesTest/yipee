package main

import (
	"os"
)

func getFromEnv(key, defval string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		return defval
	} else {
		return val
	}
}

func envBoolean(key string) bool {
	if val := getFromEnv(key, ""); val == "" {
		return false
	}
	return true
}
