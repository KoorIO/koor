#!/bin/bash
workdir=${PWD} 
WEBSOCKET_PORT=5000
APPS_PORT=3001
USERS_PORT=3000
SOCIALS_PORT=3004

echo "Installing Users ..."
cd $workdir/users && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${USERS_PORT}/g" config/local.json
wait
echo "Installing Apps ..."
cd $workdir/apps && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${APPS_PORT}/g" config/local.json
wait
echo "Installing Socials ..."
cd $workdir/socials && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${SOCIALS_PORT}/g" config/local.json
wait
echo "Installing Site ..."
cd $workdir/site && npm install && bower install && \
    sed "s/\/a\//http:\/\/localhost:${APPS_PORT}\//g" config/default.json > config/local.json && \
    sed -i "s/\/u\//http:\/\/localhost:${USERS_PORT}\//g" config/local.json && \
    sed -i "s/https:\/\//http:\/\//g" config/local.json && \
    sed -i "s/wss:\/\//ws:\/\//g" config/local.json && \
    sed -i "s/\"websocket\": \"koor.io\"/\"websocket\": \"localhost:5000\"/g" config/local.json && \
    sed -i "s/\"localEnv\": false/\"localEnv\": true/g" config/local.json
wait
echo "Installing Websocket ..."
cd $workdir/websocket && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/https:\/\//http:\/\//g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${WEBSOCKET_PORT}/g" config/local.json
wait
echo "Installing Swagger ..."
cd $workdir/swagger && npm install && \
    cp config/default.json config.local.json
wait
echo "Installing Land ..."
cd $workdir/land && npm install
wait
echo "Installing Docs ..."
cd $workdir/docs && 
cd $workdir/docs && virtualenv -p /usr/bin/python3 env && \
    source env/bin/activate && pip install -r requirements.txt
wait
echo "Installing Broker ..."
cd $workdir/broker/plugins/vmq_webhooks && ./rebar3 compile
