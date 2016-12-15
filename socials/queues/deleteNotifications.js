'use strict';
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'deleteNotifications';

consumer.task = function(job, done){
    var data = job.data;
    logger.debug('Delete Notification', data.objectId);
    db.Notification.remove({
        objectType: data.objectType,
        objectId: data.objectId,
    },function(e) {
        if (!e) {
            logger.debug('Removed');
        } else {
            logger.debug('Failed', e);
        }
    });

    done();
};

module.exports = consumer;
