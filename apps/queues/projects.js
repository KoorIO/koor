'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var logger = require('../helpers/logger');
var utils = require('../helpers/utils');
consumer.name = os.hostname() + 'projects';

consumer.task = function(job, done){
    var data = job.data;
    logger.debug('Project Worker', data.projectId);
    var q = require('../queues');
    // send message create a domain to queue
    q.create(os.hostname() + 'create_domain', {
        projectId: data.projectId,
        domain: data.data.domain
    }).priority('high').save();

    // save activity
    q.create(os.hostname() + 'activities', data).priority('low').save();

    // save feed
    if (data.type === 'CREATE_PROJECT' || data.type === 'CREATE_PROJECT') {
        q.create(utils.getHostnameSocials() + 'feeds', data).priority('low').save();
        q.create(os.hostname() + 'njProjects', data).priority('high').save();
    }

    q.create(os.hostname() + 'esProjects', data).priority('high').save();
    done();
};

module.exports = consumer;
