'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var config = require('config');
var mqtt = require('mqtt');

consumer.name = os.hostname() + 'sendToDevices';

var client = mqtt.connect(config.get('broker.url'));

consumer.task = function(job, done) {
    var data = job.data;
    logger.debug('Send To Devices ', data.topic);
    client.publish(data.topic, data.message);
    done();
};

module.exports = consumer;
