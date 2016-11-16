'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'njFollows';

consumer.task = function(job, done){
    var data = job.data;
    var q = require('../queues');
    var feedData = {
        type: data.type,
        data: data,
        userId: data.userId
    };
    q.create(os.hostname() + 'feeds', feedData).priority('high').save();
    q.create(os.hostname() + 'njFollows', data).priority('high').save();

    done();
};

module.exports = consumer;