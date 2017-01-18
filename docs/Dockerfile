FROM nginx:latest
MAINTAINER Nguyen Sy Thanh Son

RUN apt-get install -y python3-pip
WORKDIR /build
COPY ./requirements.txt /build/
RUN pip3 install -r requirements.txt
COPY ./ /build
RUN mkdocs build
COPY ./site/ /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
