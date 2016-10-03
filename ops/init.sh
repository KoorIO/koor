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
npm install -g nodemon grunt-cli gulp bower

echo Install MongoDb ...
apt-get install mongodb

echo Install Redis ...
apt-get install redis-server

echo Install Erlang OTP 19 ...
wget -c -O- http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | apt-key add -
echo "deb http://packages.erlang-solutions.com/ubuntu trusty contrib" | tee -a /etc/apt/sources.list.d/erlang_solutions.list > /dev/null
apt-get update
apt-get install -y erlang-base
apt-get -y install erlang

echo Install DEV Enviroment ...
git clone https://github.com/VundleVim/Vundle.vim.git /home/dev/.vim/bundle/Vundle.vim && \
    cd /tmp && git clone https://github.com/thanhson1085/sonnix.git && cd sonnix && \
    cat bashrc >> /home/dev/.bashrc && cat vimrc > /hom/dev/.vimrc && \
    vim +PluginInstall +qall
