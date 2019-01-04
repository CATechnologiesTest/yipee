#!/bin/bash
TAG=1.2

CVT_IMG=yipee-converter:$TAG
API_IMG=yipee-api:$TAG
UI_IMG=yipee-ui:$TAG


(cd converter; docker build -t $CVT_IMG .) || exit 1
(cd api; bash api_build.sh $CVT_IMG $API_IMG) || exit 1
(cd ui; docker build -t $UI_IMG .) || exit 1
