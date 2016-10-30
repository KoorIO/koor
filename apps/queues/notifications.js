'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var db = require('../models');
var logger = require('../helpers/logger');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'notifications';

consumer.task = function(job, done){
    var data = job.data;
    var notification = new db.Notification({
        type: data.type,
        data: data.data,
        userId: data.userId
    });

    logger.debug('New Notification', data.userId);
    cache.publish('notifications', JSON.stringify(notification));

    notification.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Notification', data.userId);
        } else {
            logger.debug('Saved Notification', notification._id);
        }
    });
    var q = require('../queues');
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
