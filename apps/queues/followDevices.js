'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var utils = require('../helpers/utils');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'appNotifications';

consumer.task = function(job, done){
    var data = job.data;

    var q = require('../queues');
    logger.debug('New App Notification', data.userId);
    // send to socials notifications
    var feed = {
        type: 'FOLLOW_DEVICE',
        userId: data.userId,
        data: data
    }
    q.create(utils.getHostnameSocials() + 'feeds', data).priority('low').save();
    q.create(os.hostname() + 'esFollowDevices', data).priority('low').save();
    q.create(os.hostname() + 'njFollowDevices', data).priority('low').save();

    done();
};

module.exports = consumer;
