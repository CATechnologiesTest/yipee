#!/bin/bash

. common_build.sh
dobuild
exit $?
# image creation and push is done by jenkins plugin
