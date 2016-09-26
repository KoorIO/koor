FROM mhart/alpine-node:4.4
MAINTAINER Nguyen Sy Thanh Son


RUN npm install -g pm2

WORKDIR /build
COPY ./package.json /build/package.json

COPY . /build

EXPOSE 80:80

CMD ["pm2", "start", "-x", "--no-daemon", "--no-autorestart", "index.js"]
