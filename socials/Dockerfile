FROM node:6-alpine
MAINTAINER Nguyen Sy Thanh Son

RUN apk add --update imagemagick \
    python \
    make g++

RUN npm install -g pm2

WORKDIR /build
COPY ./package.json /build
RUN npm install
COPY ./ /build

EXPOSE 3000

RUN cp /build/config/default.json /build/config/local.json
CMD ["pm2", "start", "-x", "--no-daemon", "index.js"]
