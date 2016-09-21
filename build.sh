#!/bin/bash

workdir=${PWD} 

cd $workdir/site && grunt build
wait
cd $workdir && sudo docker-compose build
