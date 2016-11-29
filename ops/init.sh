#!/bin/bash

sudo su -

COMPOSE_VERSION=1.9.0

echo Installing Docker ...
wget -qO- https://get.docker.com/ | sh && usermod -aG docker vagrant

echo Installing Docker Compose
curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo Installing VirtualEnv ...
apt-get install -y python-virtualenv

echo Installing ImageMagick ...
apt-get install -y imagemagick

echo Installing NodeJS 4x ...
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt-get install -y nodejs
npm install -g npm@latest
npm install -g nodemon grunt-cli gulp bower

echo Installing GEM Compass
apt-get install -y ruby-dev
gem install sass
gem install compass

echo Installing MongoDb ...
apt-get install -y mongodb

echo Installing Redis ...
apt-get install -y redis-server

echo Installing Erlang OTP 19 ...
wget -c -O- http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | apt-key add -
echo "deb http://packages.erlang-solutions.com/ubuntu trusty contrib" | tee -a /etc/apt/sources.list.d/erlang_solutions.list > /dev/null
apt-get update
apt-get install -y erlang-base
apt-get -y install erlang

echo Install DEV Enviroment ...
git clone https://github.com/VundleVim/Vundle.vim.git /home/vagrant/.vim/bundle/Vundle.vim && \
    cd /tmp && git clone https://github.com/thanhson1085/sonnix.git && cd sonnix && \
    cat bashrc >> /home/vagrant/.bashrc && cat vimrc > /home/vagrant/.vimrc && \
    vim +PluginInstall +qall

echo Git User Information
git config --global user.email "thanhson1085@gmail.com"
git config --global user.name "Nguyen Sy Thanh Son"
