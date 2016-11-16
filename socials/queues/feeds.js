'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var db = require('../models');
var logger = require('../helpers/logger');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'feeds';

consumer.task = function(job, done){
    var data = job.data;
    var feed = new db.Feed({
        type: data.type,
        data: data.data,
        userId: data.userId
    });

    logger.debug('New Feed', data.userId);
    cache.publish('feeds', JSON.stringify(feed));

    feed.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Feed', data.userId);
        } else {
            logger.debug('Saved Feed', feed._id);
        }
    });

    done();
};

module.exports = consumer;
