#! /bin/bash

docker build . -t $npm_package_name:$npm_package_version
docker run --name=$npm_package_name -d -p 8001:8001 -p 8002:8002 $npm_package_name:$npm_package_version

