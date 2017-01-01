#!/bin/bash
echo -e '\033[0;32m'
echo '
 _  _             _  _  
| |// _  _  _    | |/ \ 
|  ( /o\/o\/_|   | ( o )
|_|\\\_/\_/L| () |_|\_/ 
                        
'
echo -e '\033[0;37m'

workdir=${PWD} 
WEBSOCKET_PORT=5000
APPS_PORT=3001
USERS_PORT=3000
CHATS_PORT=3006
SOCIALS_PORT=3004
HOSTNAME=`hostname`

echo "GitHub Client ID? (press enter if no change)"
read github_client_id
echo "GitHub Client Secret? (press enter if no change)"
read github_client_secret


echo "Installing Users ..."
cd $workdir/users && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/http:\/\/users/http:\/\/localhost:${USERS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/socials/http:\/\/localhost:${SOCIALS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/chats/http:\/\/localhost:${CHATS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/apps/http:\/\/localhost:${APPS_PORT}/g" config/local.json && \
    sed -i "s/build_socials_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/build_websocket_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/es:9200/localhost:9200/g" config/local.json && \
    sed -i "s/bolt:\/\/neo4j/bolt:\/\/localhost/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${USERS_PORT}/g" config/local.json

if [ "$github_client_secret" != "" ];
then
    cd $workdir/users && \
        sed -i "s/:client_secret:/${github_client_secret}/g" config/local.json
fi

wait
echo "Installing Apps ..."
cd $workdir/apps && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/http:\/\/users/http:\/\/localhost:${USERS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/socials/http:\/\/localhost:${SOCIALS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/chats/http:\/\/localhost:${CHATS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/apps/http:\/\/localhost:${APPS_PORT}/g" config/local.json && \
    sed -i "s/build_socials_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/build_websocket_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/es:9200/localhost:9200/g" config/local.json && \
    sed -i "s/bolt:\/\/neo4j/bolt:\/\/localhost/g" config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${APPS_PORT}/g" config/local.json
wait
echo "Installing Socials ..."
cd $workdir/socials && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/http:\/\/users/http:\/\/localhost:${USERS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/socials/http:\/\/localhost:${SOCIALS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/chats/http:\/\/localhost:${CHATS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/apps/http:\/\/localhost:${APPS_PORT}/g" config/local.json && \
    sed -i "s/build_socials_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/build_websocket_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/\"fileUrl\": \"https:\/\/files.koor.io\"/\"fileUrl\": \"http:\/\/localhost:${SOCIALS_PORT}\"/g" config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${SOCIALS_PORT}/g" config/local.json
wait
echo "Installing Chats ..."
cd $workdir/chats && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/http:\/\/users/http:\/\/localhost:${USERS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/socials/http:\/\/localhost:${SOCIALS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/chats/http:\/\/localhost:${CHATS_PORT}/g" config/local.json && \
    sed -i "s/http:\/\/apps/http:\/\/localhost:${APPS_PORT}/g" config/local.json && \
    sed -i "s/build_socials_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/build_websocket_1/${HOSTNAME}/g" config/local.json && \
    sed -i "s/\/\/db:/\/\/localhost:/g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${CHATS_PORT}/g" config/local.json
wait
echo "Installing Site ..."
cd $workdir/site && npm install && bower install && \
    sed "s/\/a\//http:\/\/localhost:${APPS_PORT}\//g" config/default.json > config/local.json && \
    sed -i "s/\/u\//http:\/\/localhost:${USERS_PORT}\//g" config/local.json && \
    sed -i "s/\/s\//http:\/\/localhost:${SOCIALS_PORT}\//g" config/local.json && \
    sed -i "s/\/a\//http:\/\/localhost:${APPS_PORT}\//g" config/local.json && \
    sed -i "s/\/c\//http:\/\/localhost:${CHATS_PORT}\//g" config/local.json && \
    sed -i "s/https:\/\//http:\/\//g" config/local.json && \
    sed -i "s/wss:\/\//ws:\/\//g" config/local.json && \
    sed -i "s/\"mqtt\": \"koor.io\"/\"mqtt\": \"localhost:${APPS_PORT}\"/g" config/local.json && \
    sed -i "s/\"websocket\": \"koor.io\"/\"websocket\": \"localhost:5000\"/g" config/local.json && \
    sed -i "s/\"localEnv\": false/\"localEnv\": true/g" config/local.json

if [ "$github_client_id" != "" ];
then
    cd $workdir/site && \
        sed -i "s/:clientId:/${github_client_id}/g" config/local.json
fi

wait
echo "Installing Websocket ..."
cd $workdir/websocket && npm install && \
    sed "s/\"host\": \"redis\"/\"host\": \"localhost\"/g" config/default.json > config/local.json && \
    sed -i "s/https:\/\//http:\/\//g" config/local.json && \
    sed -i "s/\"port\": 80/\"port\": ${WEBSOCKET_PORT}/g" config/local.json
wait
echo "Installing Swagger ..."
cd $workdir/swagger && npm install
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

wait
echo "Building Broker ..."
cd $workdir && docker-compose build broker
