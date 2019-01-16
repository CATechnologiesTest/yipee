package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"reflect"
	"strings"
	"testing"
)

type environment []string

func envstr(key, value string) string {
	return key + "=" + value
}

const (
	B         = "B"
	BAR       = "BAR"
	BAZ       = "BAZ"
	FOO       = "FOO"
	YIPEE_BAR = "YIPEE_BAR"
	YIPEE_A   = "YIPEE_A"
)

var (
	FooBar                  = envstr(FOO, BAR)
	YipeeBarBaz             = envstr(YIPEE_BAR, BAZ)
	YipeeStaticInstall      = envstr(INSTALL_TYPE, STATIC_INSTALL)
	YipeeLiveInstall        = envstr(INSTALL_TYPE, LIVE_INSTALL)
	EmptyEnv                = environment{}
	NoYipees                = environment{FooBar}
	YipeesNoInstall         = environment{envstr(YIPEE_A, B)}
	YipeesBadInstallValue   = environment{envstr(INSTALL_TYPE, FOO)}
	YipeesWithStaticInstall = environment{YipeeBarBaz, YipeeStaticInstall}
	YipeesWithLiveInstall   = environment{YipeeBarBaz, YipeeLiveInstall}
	YipeeLiveInstallOnly    = environment{YipeeLiveInstall}
)

func add404TestConfigs(cfgtests []*configtest) []*configtest {
	my404envs :=
		[]environment{EmptyEnv, YipeesNoInstall, YipeesBadInstallValue,
			YipeesWithStaticInstall, YipeesWithLiveInstall, YipeeLiveInstallOnly}
	for _, e := range my404envs {
		cfgtests = append(cfgtests, &configtest{"/configs/" + FOO, e, 404, []string{}})
	}
	return cfgtests
}

type configtest struct {
	path            string
	env             environment
	expStatus       int
	expectedConfigs interface{}
}

func TestConfigRetrieval(t *testing.T) {
	configtests := []*configtest{
		&configtest{"/configs", EmptyEnv, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs", NoYipees, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs", YipeesNoInstall, 200, []JsonObject{
			mergeObjects(
				populateJsonObj(YIPEE_A, B),
				populateJsonObj(INSTALL_TYPE, STATIC_INSTALL))}},
		&configtest{"/configs", YipeesBadInstallValue, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs", YipeesWithStaticInstall, 200, []JsonObject{
			mergeObjects(
				populateJsonObj(YIPEE_BAR, BAZ),
				populateJsonObj(INSTALL_TYPE, STATIC_INSTALL))}},
		&configtest{"/configs", YipeesWithLiveInstall, 200, []JsonObject{
			mergeObjects(
				populateJsonObj(YIPEE_BAR, BAZ),
				populateJsonObj(INSTALL_TYPE, LIVE_INSTALL))}},
		&configtest{"/configs", YipeeLiveInstallOnly, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, LIVE_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, EmptyEnv, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, NoYipees, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, YipeesNoInstall, 200, []JsonObject{
			populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, YipeesBadInstallValue, 200,
			[]JsonObject{populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, YipeesWithStaticInstall, 200,
			[]JsonObject{populateJsonObj(INSTALL_TYPE, STATIC_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, YipeesWithLiveInstall, 200,
			[]JsonObject{populateJsonObj(INSTALL_TYPE, LIVE_INSTALL)}},
		&configtest{"/configs/" + INSTALL_TYPE, YipeeLiveInstallOnly, 200,
			[]JsonObject{populateJsonObj(INSTALL_TYPE, LIVE_INSTALL)}},
		&configtest{"/configs/" + FOO, NoYipees, 200, []JsonObject{
			populateJsonObj(FOO, BAR)}},
	}
	add404TestConfigs(configtests)

	for _, ct := range configtests {
		path, exp_status, exp_cfgs := ct.path, ct.expStatus, ct.expectedConfigs
		setEnvironment(t, ct.env)
		req := httptest.NewRequest(http.MethodGet, path, nil)
		if exp_status == 200 {
			cfgs := exp_cfgs.([]JsonObject)
			result := doSuccessRequest(t, req)
			checkSuccessResult(t, path, ct.env, cfgs, result)
		} else {
			doErrRequest(t, req)
		}
	}
}

func checkSuccessResult(
	t *testing.T, path string, e environment, exp []JsonObject, r *ObjResp) {
	config := r.Data
	if ok := reflect.DeepEqual(exp, config); !ok {
		t.Errorf("get %s = %v for environment %v, wants %v\n",
			path, config, e, exp)
	}
}

func populateJsonObj(k, v string) JsonObject {
	jo := make(map[string]interface{})
	jo[k] = v
	return jo
}

func mergeObjects(a JsonObject, b JsonObject) JsonObject {
	for k, v := range b {
		a[k] = v
	}
	return a
}

func setEnvironment(t *testing.T, e environment) []string {
	orig_env := os.Environ()
	os.Clearenv()
	for _, v := range e {
		var keyval []string
		keyval = strings.Split(v, "=")
		k := keyval[0]
		v := keyval[1]
		err := os.Setenv(k, v)
		if err != nil {
			t.Errorf("Unable to set environment variable, %s to %s", k, v)
		}
	}
	return orig_env
}
