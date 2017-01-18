FROM nginx:latest
MAINTAINER Nguyen Sy Thanh Son

RUN apt-get update && apt-get install -y curl \
                                         git  \
                                         ruby \
                                         ruby-dev \
                                         build-essential \
                                         nodejs \
                                         rubygems

RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@latest
RUN npm install -g grunt-cli bower
RUN gem install sass
RUN gem install compass
WORKDIR /build
COPY ./package.json /build/
RUN npm install
COPY ./bower.json /build/
RUN bower --allow-root install -g
RUN grunt build

RUN cp -R ./dist/ /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
