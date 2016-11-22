'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
var utils = require('../helpers/utils');
consumer.name = os.hostname() + 'devices';

consumer.task = function(job, done){
    var data = job.data;
    logger.debug('Device Worker', data._id, data.projectId);
    var q = require('../queues');
    var feed = {
        type: data.type,
        userId: data.userId,
        data: data.device
    }
    q.create(utils.getHostnameSocials() + 'feeds', data).priority('low').save();
    done();
};

module.exports = consumer;
