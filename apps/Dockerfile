FROM mhart/alpine-node:4.4
MAINTAINER Nguyen Sy Thanh Son

RUN npm install -g pm2

WORKDIR /build
COPY ./ /build

EXPOSE 3000

RUN cp /build/config/default.json /build/config/local.json
CMD ["pm2", "start", "-x", "--no-daemon", "index.js"]
