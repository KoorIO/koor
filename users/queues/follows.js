'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var utils = require('../helpers/utils');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'follows';

consumer.task = function(job, done){
    var data = job.data;
    var q = require('../queues');
    var feedData = {
        type: 'FOLLOW_USER',
        data: data,
        userId: data.followerId
    };
    q.create(utils.getHostnameSocials() + 'feeds', feedData).priority('high').save();
    q.create(os.hostname() + 'njFollows', data).priority('high').save();
	q.create(utils.getHostnameSocials() + 'notifications', {
		type: 'FOLLOW_USER',
		userId: data.userId,
		data: data
	}).priority('high').save();

    done();
};

module.exports = consumer;
