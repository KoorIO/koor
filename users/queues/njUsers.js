'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'njUsers';

consumer.task = function(job, done){
    var data = job.data;

    services.User.getUserById(data).then(function(body) {
        var session = driver.session();
        if (!body._id) {
            session
            .run('MATCH (u:Users {userId: {userId}}) DELETE u', { userId: body._id })
			.subscribe({
    onCompleted: function() {
        logger.debug('Delete Recommendation User', data.userId);
        session.close();
    },
    onError: function(error) {
        logger.error(error);
    }
});
        } else {
            session
            .run('MERGE (u:Users {userId: {userId}})', { userId: body._id })
			.subscribe({
    onCompleted: function() {
        logger.debug('Create Recommendation User', data.userId);
        session.close();
    },
    onError: function(error) {
        logger.error(error);
    }
});
        }
    }).catch(function(e) {
        logger.error(e)
    });
    done();
};

module.exports = consumer;
