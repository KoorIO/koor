'use strict';
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'feeds';

consumer.task = function(job, done) {
    var data = job.data;
    var feed = new db.Feed({
        objectId: data.objectId,
        objectType: data.objectType,
        type: data.type,
        data: data.data,
        userId: data.userId
    });

    logger.debug('New Feed', data.userId, data.objectType, data.objectId);
    cache.publish('feeds', JSON.stringify(feed));

    feed.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Feed', data.userId, error);
        } else {
            logger.debug('Saved Feed', feed._id);
        }
    });
    done();
};

module.exports = consumer;
