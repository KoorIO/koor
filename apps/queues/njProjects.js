'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'njProjects';

consumer.task = function(job, done) {
    var data = job.data;

    services.Project.getProjectById({
        projectId: data.data._id,
        accessToken: data.accessToken
    }).then(function(body) {
        var session = driver.session();
        if (!body._id) {
            session
            .run('MATCH (u:Projects {projectId: {projectId}}) DELETE u', { projectId: body._id })
			.subscribe({
    onCompleted: function() {
        logger.debug('Delete Recommendation Project', data.projectId);
        session.close();
    },
    onError: function(error) {
        logger.error(error);
    }
});
        } else {
            session
            .run('MERGE (u:Projects {projectId: {projectId}})', { projectId: body._id })
			.subscribe({
    onCompleted: function() {
        logger.debug('Create Recommendation Project', data.projectId);
        session.close();
    },
    onError: function(error) {
        logger.error(error);
    }
});
        }
    }).catch(function(e) {
        logger.error(e);
    });
    done();
};

module.exports = consumer;
