'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var config = require('config');
var mqtt = require('mqtt');

consumer.name = os.hostname() + 'sendToDevices';

var client = mqtt.connect(config.get('broker.url'));

client.on('error', function() {
    logger.debug('Failed - Connect MQTT, retry after 1 second');
});

client.on('connect', function() {
    logger.debug('Connect MQTT successfully');
});

consumer.task = function(job, done) {
    var data = job.data;
    logger.debug('Send To Devices ', data.topic);
    client.publish(data.topic, data.message);
    done();
};

module.exports = consumer;
