#!/bin/bash

dobuild() {
    lein cloverage

    TESTRC=$?

    if [ $TESTRC -eq 0 ]; then
        lein uberjar
    else
        return $TESTRC
    fi
}
