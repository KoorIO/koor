'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
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
            logger.debug('Created FOLLOW Relationship User %s Follower %s', data.userId, data.followerId);
            session.close();
        },
        onError: function(error) {
            logger.error('Failed', error);
        }
    });
    done();
};

module.exports = consumer;
