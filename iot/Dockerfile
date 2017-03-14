FROM node:6-alpine
MAINTAINER Nguyen Sy Thanh Son

RUN npm install -g pm2

WORKDIR /build
COPY ./package.json /build/package.json

RUN npm install

COPY . /build

EXPOSE 80:80

RUN cp /build/config/default.json /build/config/local.json
CMD ["pm2", "start", "-x", "--no-daemon", "index.js"]
