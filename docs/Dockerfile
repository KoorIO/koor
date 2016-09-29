FROM python:alpine
MAINTAINER Nguyen Sy Thanh Son

WORKDIR /build

ADD ./requirements.txt /build/requirements.txt
RUN pip install -r requirements.txt
ADD . /build

CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:80"]
