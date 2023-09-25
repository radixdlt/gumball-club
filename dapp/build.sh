#!/bin/bash

set -e

# Build the docker image
docker build -t gumball-club:latest . --build-arg NETWORK_NAME=Mainnet 