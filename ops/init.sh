#!/bin/bash

sudo su -

COMPOSE_VERSION=1.8.0

echo Installing Docker ...
wget -qO- https://get.docker.com/ | sh

echo Installing Docker Compose
curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo Installing VirtualEnv ...
apt-get install -y python-virtualenv

echo Installing NodeJS 4x ...
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt-get install -y nodejs
npm install -g npm@latest
npm install -g nodemon grunt-cli gulp
