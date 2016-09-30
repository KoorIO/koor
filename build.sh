#!/bin/bash

workdir=${PWD} 

cd $workdir/site && grunt build
cd $workdir/docs && PATH=$PATH:./env/bin/ && mkdocs build
wait
cd $workdir && sudo docker-compose build
