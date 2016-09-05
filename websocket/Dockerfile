FROM mhart/alpine-node:4.4
MAINTAINER Nguyen Sy Thanh Son


RUN npm install -g pm2

WORKDIR /build
COPY ./package.json /build/package.json

RUN npm install

COPY . /build

EXPOSE 80:80

RUN chmod +x /build/entrypoint.sh

ENTRYPOINT ["/build/entrypoint.sh"]
