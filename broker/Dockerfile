FROM debian:jessie
MAINTAINER Nguyen Sy Thanh Son

RUN apt-get update && apt-get install -y \
    libssl-dev \
    logrotate \
    sudo \
&& rm -rf /var/lib/apt/lists/*

ENV VERNEMQ_VERSION 0.14.1

ADD https://bintray.com/artifact/download/erlio/vernemq/deb/jessie/vernemq_$VERNEMQ_VERSION-1_amd64.deb /tmp/vernemq.deb

RUN dpkg -i /tmp/vernemq.deb
RUN rm /tmp/vernemq.deb

COPY files/vm.args /etc/vernemq/vm.args
COPY bin/vernemq.sh /usr/sbin/start_vernemq
COPY bin/rand_cluster_node.escript /var/lib/vernemq/rand_cluster_node.escript
COPY plugins/ /build

#RUN vmq-admin plugin enable --name=vmq_webhooks --path=/build/vmq_webhooks/_build/default/
#RUN vmq-admin plugin disable -n vmq_passwd
#RUN vmq-admin plugin disable -n vmq_acl
#RUN vmq-admin webhooks register hook=auth_on_register endpoint="http://apps/api/v1/mqtt/auth_on_register"
#RUN vmq-admin webhooks register hook=auth_on_subscribe endpoint="http://apps/api/v1/mqtt/auth_on_subscribe"
#RUN vmq-admin webhooks register hook=auth_on_publish endpoint="http://apps/api/v1/mqtt/auth_on_publish"

EXPOSE \ 
    # MQTT
    1883 \
    # MQTT WebSockets
    8080 \
    # VerneMQ Message Distribution
    44053 \
    # EPMD - Erlang Port Mapper Daemon
    4349 \
    # Specific Distributed Erlang Port Range 
    9100 9101 9102 9103 9104 9105 9106 9107 9108 9109 \
    # Prometheus Metrics
    8888

VOLUME ["/var/log/vernemq", "/var/lib/vernemq", "/etc/vernemq"]

CMD ["start_vernemq"] 
