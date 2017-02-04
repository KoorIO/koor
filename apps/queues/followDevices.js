'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'followDevices';

consumer.task = function(job, done) {
    var data = job.data;

    var q = require('../queues');
    logger.debug('New Follow Devices', data.userId);
    // send to socials notifications
    var feed = {
        type: 'FOLLOW_DEVICE',
        userId: data.userId,
        data: data
    };
    q.create('feeds', feed).priority('low').save();
    q.create(os.hostname() + 'esFollowDevices', data).priority('low').save();
    q.create(os.hostname() + 'njFollowDevices', data).priority('low').save();

    done();
};

module.exports = consumer;
