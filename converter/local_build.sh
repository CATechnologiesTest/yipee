#!/bin/bash

REGISTRY=yipee-development
IMAGE=k10ehlive-converter
# XXX: just using "latest" here until we have automated build...
#TAG=development

mktaggedname() {
    basename=$1
    if [ "$TAG" != "" ]; then
        echo $basename:$TAG
    else
        echo $basename
    fi
}

# docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app -e DEBUG_COMPILE=${DEBUG_COMPILE} -e NO_PERF_COMPILE=${NO_PERF_COMPILE} -e PERF_MON=${PERF_MON} -e SHOW_RULES=${SHOW_RULES} clojure:alpine lein test
lein test
TESTRC=$?

if [ $TESTRC -eq 0 ]; then
    lein uberjar || exit 1
    docker build -t $REGISTRY/$IMAGE .
    IMGNAME=$(mktaggedname $IMAGE)
    docker tag $REGISTRY/$IMAGE yipee-tools-spoke-cos.ca.com:5000/$IMGNAME
else
    exit $TESTRC
fi

