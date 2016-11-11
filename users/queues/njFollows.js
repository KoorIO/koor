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

    var session = driver.session();
    session
    .run('MATCH (u:Users {userId: "' + data.userId + '"}) \
         MATCH (f:Users {userId: "' + data.followerId + '"})\
         CREATE (f)-[:FOLLOW]->(u)')
    .subscribe({
        onCompleted: function() {
            logger.debug('Create FOLLOW Relationship User', data.userId, data.followerId);
            session.close();
        },
        onError: function(error) {
            logger.error(error);
        }
    });
    done();
};

module.exports = consumer;
