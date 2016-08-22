#!/usr/bin/env bash

SWD=`pwd`

cd ui && gulp && cd $SWD;

mvn clean

cp -r ui/dist/* src/main/webapp/

mvn install

