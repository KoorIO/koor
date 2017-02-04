'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var services = require('../services');
consumer.name = os.hostname() + 'projects';

consumer.task = function(job, done) {
    var data = job.data;
    logger.debug('Project Worker', data.projectId);
    var q = require('../queues');
    // send message create a domain to queue
    q.create(os.hostname() + 'create_domain', {
        projectId: data.projectId,
        domain: data.data.domain
    }).priority('high').save();

    services.User.getUserById(data).then(function(user) {
        services.Project.getProjectById(data).then(function(project) {
            if (project._id && user._id) {
                delete project['secretKey'];
                data.data.user = user;
                data.data.object = project;

                // save activity
                q.create(os.hostname() + 'activities', data).priority('low').save();

                // save feed
                if (data.type === 'CREATE_PROJECT' || data.type === 'CREATE_PROJECT') {
                    var feed = {
                        data: data.data,
                        objectType: 'PROJECT',
                        objectId: data.data._id,
                        type: data.type,
                        userId: data.userId
                    };
                    q.create('feeds', feed).priority('low').save();
                    q.create(os.hostname() + 'njProjects', data).priority('high').save();
                }
                q.create(os.hostname() + 'esProjects', data).priority('high').save();
            }
        }).catch(function(e) {
            logger.error('Failed - get project detail', e);
        });
    }).catch(function(e) {
        logger.error('Failed - get user detail', e);
    });

    done();
};

module.exports = consumer;
