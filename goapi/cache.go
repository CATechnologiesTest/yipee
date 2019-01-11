package main

import (
	"time"
)

func runServer(mbox <-chan *cacheRequest) {
	for {
		req, ok := <-mbox
		if ok {
			req.replyChan <- req.operation()
		} else {
			break
		}
	}
}

var client CacheClient

type cacheOp func() interface{}

type cacheEntry struct {
	timer *time.Timer
	obj   interface{}
}

type cacheMap map[string]cacheEntry

type cacheRequest struct {
	operation cacheOp
	replyChan chan interface{}
}

type clientif interface {
	Lookup(key string) interface{}
	Remove(key string) interface{}
	Add(key string, obj interface{}) bool
}

type CacheClient struct {
	serverMbox  chan<- *cacheRequest
	cache       cacheMap
	maxSize     int
	timeoutSecs int
}

func NewCache(maxSize int, timeoutSecs int) *CacheClient {
	cache := make(cacheMap)
	serverMbox := make(chan *cacheRequest)
	go runServer(serverMbox)
	return &CacheClient{serverMbox, cache, maxSize, timeoutSecs}
}

func runOnServer(fun cacheOp, svr chan<- *cacheRequest) interface{} {
	replyChan := make(chan interface{})
	req := &cacheRequest{fun, replyChan}
	svr <- req
	return <-replyChan
}

func (client *CacheClient) Lookup(key string) interface{} {
	return runOnServer(
		func() interface{} {
			if val, ok := client.cache[key]; ok {
				return val.obj
			}
			return nil
		}, client.serverMbox)
}

func (client *CacheClient) Remove(key string) interface{} {
	return runOnServer(
		func() interface{} {
			if val, ok := client.cache[key]; ok {
				if val.timer != nil {
					val.timer.Stop()
				}
				delete(client.cache, key)
				return val.obj
			}
			return nil
		}, client.serverMbox)
}

func (client *CacheClient) Add(key string, obj interface{}) bool {
	return runOnServer(
		func() interface{} {
			if !client.hasSpace() {
				return false
			}
			t := client.getTimeoutFun(key)
			client.cache[key] = cacheEntry{t, obj}
			return true
		}, client.serverMbox).(bool)
}

func (client *CacheClient) hasSpace() bool {
	if client.maxSize > 0 {
		return len(client.cache) < client.maxSize
	}
	return true
}

func (client *CacheClient) getTimeoutFun(key string) *time.Timer {
	if client.timeoutSecs > 0 {
		return time.AfterFunc(time.Duration(client.timeoutSecs)*time.Second,
			func() {
				client.Remove(key)
			})
	}
	return nil
}

// compilation error if we don't implement the i/f properly
var _ clientif = (*CacheClient)(nil)
