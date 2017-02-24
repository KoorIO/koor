#!/bin/bash

for s in $(docker images --filter 'dangling=true' -q --no-trunc);
do 
  docker rmi $s
done
