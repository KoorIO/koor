'use strict';
var consumer = {};
var os = require('os');
var db = require('../models');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'deleteFeeds';

consumer.task = function(job, done){
    var data = job.data;
    logger.debug('Delete Feed', data.id);
    db.Feed.findOneAndRemove({
        objectType: data.type,
        objectId: data.id
    }).then(function(feed) {
        if (feed) {
            logger.debug('Removed', feed._id);
        }
    }).catch(function(e) {
        logger.debug('Failed', e)
    });;

    done();
};

module.exports = consumer;
