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
    q.create(os.hostname() + 'notifications', data).priority('high').removeOnComplete(true).save();

    done();
};

module.exports = consumer;
