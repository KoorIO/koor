'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'appNotifications';

consumer.task = function(job, done){
    var data = job.data;

    var q = require('../queues');
    logger.debug('New App Notification', data.userId);
    // send to socials notifications
    q.create(os.hostname() + 'notifications', data).priority('low').save();

    if (data.type === 'DEVICE_ON') {
        var log = {
            type: 'DEVICE_ON',
            deviceId: data.data._id,
            data: data.data
        };
        q.create(os.hostname() + 'deviceLogs', log).priority('low').save();
    }
    if (data.type === 'DEVICE_OFF') {
        var log = {
            type: 'DEVICE_OFF',
            deviceId: data.data._id,
            data: data.data
        };
        q.create(os.hostname() + 'deviceLogs', log).priority('low').save();
    }

    done();
};

module.exports = consumer;
