'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var utils = require('../helpers/utils');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'unfollows';

consumer.task = function(job, done){
    var data = job.data;
    var q = require('../queues');
    var feedData = {
        type: 'FOLLOW_USER',
        id: data._id
    };
    q.create(utils.getHostnameSocials() + 'deleteFeeds', feedData).priority('high').save();
    q.create(os.hostname() + 'njUnFollows', data).priority('high').save();
	q.create(utils.getHostnameSocials() + 'deleteNotifications', {
        type: 'FOLLOW_USER',
        id: data._id
	}).priority('high').save();

    done();
};

module.exports = consumer;
