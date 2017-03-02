#!/bin/bash

source .env
git fetch origin && git checkout origin/master && \
  docker-compose build && \
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop && \
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm -f cms && \
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d && \
  bash ./clean.sh
