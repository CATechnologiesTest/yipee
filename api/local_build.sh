#!/bin/bash
REGISTRY=yipee-development
DC_PROJECT=k10ehlive-api
IMAGE=k10ehlive-api
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

export RETURN_ERRORS_FOR_TESTING=true

docker-compose -f docker-compose-test.yml pull
docker-compose -f docker-compose-test.yml -p ${DC_PROJECT} up --abort-on-container-exit --exit-code-from nodejs

TESTRC=$?

docker-compose -f docker-compose-test.yml -p ${DC_PROJECT} down -v

if [ $TESTRC -eq 0 ]; then
    docker build -t $REGISTRY/$IMAGE .
    IMGNAME=$(mktaggedname $IMAGE)
    docker tag $REGISTRY/$IMAGE yipee-tools-spoke-cos.ca.com:5000/$IMGNAME
else
    exit $TESTRC
fi
