#!/bin/bash

IMG="$1"
if [ -z $IMG ]; 
then
   IMG="api"
fi

sh ./elf_build.sh

docker build -t $IMG .
