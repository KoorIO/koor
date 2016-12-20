'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var utils = require('../helpers/utils');

consumer.name = os.hostname() + 'unfollows';

consumer.task = function(job, done){
    var data = job.data;
    var q = require('../queues');
    logger.debug('Queue', os.hostname(), 'unfollows');
    var feedData = {
        type: 'FOLLOW_USER',
        objectId: data._id,
        objectType: 'FOLLOWER'
    };
    q.create(utils.getHostnameSocials() + 'deleteFeeds', feedData).priority('high').save();
    q.create(os.hostname() + 'njUnFollows', data).priority('high').save();
    q.create(utils.getHostnameSocials() + 'deleteNotifications', {
        type: 'FOLLOW_USER',
        objectId: data._id,
        objectType: 'FOLLOWER'
    }).priority('high').save();

    done();
};

module.exports = consumer;
