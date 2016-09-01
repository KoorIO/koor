#!/bin/bash
workdir=${PWD} 

echo "Installing Users ..."
cd $workdir/users && npm install && \
    cp config/default.json config/local.json
wait
echo "Installing Apps ..."
cd $workdir/apps && npm install && \
    cp config/default.json config/local.json
wait
echo "Installing Site ..."
cd $workdir/site && npm install && bower install && \
    cp config/default.json config/local.json
wait
echo "Installing Land ..."
cd $workdir/land && npm install
