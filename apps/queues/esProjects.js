'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var services = require('../services');
consumer.name = os.hostname() + 'esProjects';

consumer.task = function(job, done){
    var data = job.data;
    var type = 'projects';

    logger.debug('Create Search Project', data.data._id);
    services.Project.getProjectById({
        accessToken: data.accessToken,
        projectId: data.data._id
    }).then(function(body) {
        if (!body._id) {
            es.delete({
                index: config.get('es.index'),
                type: type,
                id: data.data._id
            }, function (error) {
                logger.debug('Delete a Project in Search', data.data._id, error);
            });
        } else {
            delete body['_id'];
            es.index({
                index: config.get('es.index'),
                type: type,
                id: data.data._id,
                body: body
            }, function (error) {
                if (error) {
                    logger.error('Failed - Save Project Search', error);
                }
                logger.debug('Create/Update a Project in Search', data.data._id);
            });
        }
    }).catch(function(e) {
        logger.error(e);
    });
    done();
};

module.exports = consumer;
