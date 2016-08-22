#!/usr/bin/env bash

## PREP - ensure target exists, if not, build

command -v xmllint >/dev/null 2>&1 || { echo >&2 "I require xmllint but it's not installed.  Aborting. (for ubuntu: sudo apt-get install libxml2-utils)"; exit 1; }

if [ "$1" == 'clean' ]; then
  rm -rf target;
fi

if [ ! -d "target" ]; then
  echo "It does not look like the project was build."
  echo "Building now using Maven:"
  mvn clean package
fi

if [ ! -d "target" ]; then
  echo "Build failed. Exiting"
  exit 0
fi

DOC_DIR=src/main/docker
BASE_DIR=`pwd`


GRP_ID=`xmllint --xpath "/*[local-name()='project']/*[local-name()='groupId']/text()" pom.xml`
ART_ID=`xmllint --xpath "/*[local-name()='project']/*[local-name()='artifactId']/text()" pom.xml`
VER=`xmllint --xpath "/*[local-name()='project']/*[local-name()='version']/text()" pom.xml`
P_NAME=`xmllint --xpath "/*[local-name()='project']/*[local-name()='name']/text()" pom.xml`
DOC_TAG="afrozaar/$ART_ID:$VER"

echo "BUILDING $P_NAME Docker Image from $BUILD_DIR"
echo 
echo "Copying files..."
cp -v target/$ART_ID-$VER.jar target/$ART_ID.jar
cp -v $DOC_DIR/Dockerfile target/
echo "Done."
echo 

cd target

echo "Starting Docker Build with tag: $DOC_TAG"

docker build --no-cache -t $DOC_TAG .

cd $BASE_DIR
