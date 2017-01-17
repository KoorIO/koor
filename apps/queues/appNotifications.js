'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'appNotifications';

consumer.task = function(job, done) {
    var data = job.data;

    var q = require('../queues');
    logger.debug('New App Notification', data.userId);
    // send to socials notifications
    q.create(os.hostname() + 'notifications', data).priority('low').save();

    var log = {
        type: 'DEVICE_ON',
        deviceId: data.data._id,
        data: data.data
    };
    if (data.type === 'DEVICE_ON') {
        q.create(os.hostname() + 'deviceLogs', log).priority('low').save();
    }
    if (data.type === 'DEVICE_OFF') {
        log.type = 'DEVICE_OFF',
        q.create(os.hostname() + 'deviceLogs', log).priority('low').save();
    }

    done();
};

module.exports = consumer;
