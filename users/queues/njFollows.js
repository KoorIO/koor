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
    .run('MATCH (u:Users {userId: {userId}}) \
         MATCH (f:Users {userId: {followerId}}) \
         CREATE (f)-[:FOLLOW]->(u)', {userId: data.userId, followerId: data.followerId})
    .subscribe({
        onCompleted: function() {
            logger.debug('Create FOLLOW Relationship User %s Follower %s', data.userId, data.followerId);
            session.close();
        },
        onError: function(error) {
            logger.error(error);
        }
    });
    done();
};

module.exports = consumer;
