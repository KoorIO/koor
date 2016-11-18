'use strict';
var consumer = {};
var os = require('os');
var db = require('../models');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'deleteNotifications';

consumer.task = function(job, done){
    var data = job.data;
    logger.debug('Delete Notification', data.id);
    db.Notification.findOneAndRemove({
        type: data.type,
        id: data.id
    }).then(function(notification) {
        if (notification) {
            logger.debug('Removed', notification._id);
        }
    }).catch(function(e) {
        logger.debug('Failed', e)
    });;

    done();
};

module.exports = consumer;
