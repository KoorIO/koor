'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var db = require('../models');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'notifications';

consumer.task = function(job, done){
    var data = job.data;
    var activity = new db.Notification({
        type: data.type,
        data: data.data,
        userId: data.userId
    });

    logger.debug('New Notification', data.userId);
    activity.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Notification', data.userId);
        }
    });
    done();
};

module.exports = consumer;
