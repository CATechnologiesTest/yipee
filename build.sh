#!/bin/bash
TAG=2.0

ORG=$1 
if [ -z "$ORG" ];
then
   ORG="localbuild"
fi

CVT_IMG=$ORG/converter:$TAG
API_IMG=$ORG/api:$TAG
UI_IMG=$ORG/ui:$TAG


(cd converter; docker build -t $CVT_IMG .) || exit 1
(cd goapi; bash goapi_build.sh $API_IMG ) || exit 1
(cd ui; docker build -t $UI_IMG .) || exit 1
