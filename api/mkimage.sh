#!/bin/bash
REGISTRY=yipee-development
IMAGE=k10ehlive-api

docker build -t $REGISTRY/$IMAGE .
docker tag $REGISTRY/$IMAGE yipee-tools-spoke-cos.ca.com:5000/$IMAGE:development
