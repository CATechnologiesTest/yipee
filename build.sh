#!/bin/bash
CVT_IMG=yipee-converter
API_IMG=yipee-api
UI_IMG=yipee-ui

(cd converter; docker build -t $CVT_IMG .) || exit 1
(cd api; bash api_build.sh $CVT_IMG $API_IMG) || exit 1
(cd ui; docker build -t $UI_IMG .) || exit 1
