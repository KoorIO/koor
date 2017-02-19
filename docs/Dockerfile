FROM nginx:1.11
MAINTAINER Nguyen Sy Thanh Son

RUN apt-get update && \
    apt-get install -y python3-pip libyaml-dev

WORKDIR /build
ENV LC_ALL=C.UTF-8 LANG=C.UTF-8

COPY ./requirements.txt /build/
RUN pip3 install -r requirements.txt
COPY ./ /build
RUN mkdocs build
RUN cp -R ./site/* /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
