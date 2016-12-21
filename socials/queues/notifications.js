'use strict';
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'notifications';

consumer.task = function(job, done){
    var data = job.data;
    var notification = new db.Notification({
        objectType: data.objectType,
        objectId: data.objectId,
        type: data.type,
        data: data.data,
        userId: data.userId
    });

    logger.debug('New Notification', data.userId, data.type, data.id);
    cache.publish('notifications', JSON.stringify(notification));

    notification.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Notification', error);
        } else {
            logger.debug('Saved Notification', notification._id);
        }
    });

    done();
};

module.exports = consumer;
