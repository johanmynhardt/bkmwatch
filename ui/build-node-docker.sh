#!/usr/bin/env bash

## PREP - ensure target exists, if not, build


if [ "$1" == 'clean' ]; then
  rm -rf dist;
  rm -rf build
fi

if [ ! -d "build" ]; then
  echo "It does not look like the project was build."
  echo "Building now..."
  gulp
  mkdir build
  cp -r dist build/
fi

if [ ! -d "dist" ]; then
  echo "Build failed. Exiting"
  exit 0
fi

DOC_DIR=src/main/docker
NODE_SRC_DIR=src/main/node
BASE_DIR=`pwd`
BUILD_DIR=build


ART_ID='ashes-content-archive'
VER='1.5.0-npm-SNAPSHOT'
P_NAME='Digital Asset Library'
DOC_TAG="afrozaar/$ART_ID:$VER"
DOCKER_REGISTRY="358035155708.dkr.ecr.eu-west-1.amazonaws.com"
AWS_TAG="$DOCKER_REGISTRY/$DOC_TAG"

echo "BUILDING $P_NAME Docker Image from $BUILD_DIR"
echo 
echo "Copying files..."
# cp -v dist-package.json $BUILD_DIR
cp -v $DOC_DIR/Dockerfile-node $BUILD_DIR/Dockerfile
cp -v $NODE_SRC_DIR/package.json $BUILD_DIR/package.json
cp -v $NODE_SRC_DIR/node-app.js $BUILD_DIR/node-app.js
echo "Done."
echo 

cd $BUILD_DIR

echo "Starting Docker Build with tag: $DOC_TAG"

docker build --no-cache -t $DOC_TAG .
docker tag $DOC_TAG $AWS_TAG

cd $BASE_DIR
