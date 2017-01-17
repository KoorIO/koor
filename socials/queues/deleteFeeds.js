'use strict';
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'deleteFeeds';

consumer.task = function(job, done) {
    var data = job.data;
    logger.debug('Delete Feed', data.id);
    db.Feed.findOneAndRemove({
        objectType: data.objectType,
        objectId: data.objectId
    }).then(function(feed) {
        if (feed) {
            logger.debug('Removed', feed._id);
        }
    }).catch(function(e) {
        logger.debug('Failed', e);
    });

    done();
};

module.exports = consumer;
