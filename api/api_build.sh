#!/bin/bash

CVT_NAME=api-build-converter
API_IMG=node:8.14.0-alpine
# sleep to make sure converter starts before we try to use it...
API_CMD="npm install && sleep 5 && npm test"

docker run -d --name ${CVT_NAME} $1
docker run --rm --link="${CVT_NAME}:converter" -e "CVT_URL=http://converter:3000" -v "${PWD}:/data" -w="/data" ${API_IMG} sh -c "${API_CMD}"

TESTRC=$?

docker rm -f ${CVT_NAME}

if [ $TESTRC -eq 0 ]; then
    docker build -t $2 .
else
    exit $TESTRC
fi
