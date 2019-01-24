#!/bin/bash

IMG="$1"
if [ -z $IMG ];
then
   IMG="api"
fi

sh -x ./elf_build.sh

docker build -f Dockerfile.local_build -t $IMG .
