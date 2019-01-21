#!/bin/bash
CVT_NAME=goapi-test-converter
docker run -d -p 3000:3000 --name ${CVT_NAME} yipeeio/converter
sleep 10
go test -v -coverprofile coverage.txt
rc=$?
go tool cover -html=coverage.txt -o coverage.html
docker rm -f ${CVT_NAME}
exit $rc

