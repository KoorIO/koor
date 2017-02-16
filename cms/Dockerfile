FROM ruby:2.3
MAINTAINER Nguyen Sy Thanh Son
RUN apt-get update -qq && apt-get install -y build-essential \
      libpq-dev nodejs python-pip
RUN pip install honcho

ENV PYTHONIOENCODING=utf-8

RUN mkdir /build
WORKDIR /build
ADD Gemfile /build/Gemfile
ADD Gemfile.lock /build/Gemfile.lock
RUN bundle install
ADD . /build
RUN bundle exec rake assets:precompile
RUN rm -rf config/settings.local.yml
ENTRYPOINT honcho start
