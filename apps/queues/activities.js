'use strict';
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'activities';

consumer.task = function(job, done) {
    var data = job.data;
    var activity = new db.Activity({
        type: data.type,
        data: data.data,
        userId: data.userId,
        projectId: data.projectId
    });

    logger.debug('New Activity', data.userId, data.projectId);
    activity.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Activity', data.userId, data.projectId);
        }
    });
    done();
};

module.exports = consumer;
