'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'njUnFollows';

consumer.task = function(job, done) {
    var data = job.data;

    var session = driver.session();
    session
    .run('MATCH (u)-[rel:FOLLOW]->(r) \
        WHERE u.userId = {followerId} AND r.userId = {userId} \
        DELETE rel', {userId: data.userId, followerId: data.followerId})
    .subscribe({
        onCompleted: function() {
            logger.debug('Deleted FOLLOW Relationship User %s Follower %s', data.userId, data.followerId);
            session.close();
        },
        onError: function(error) {
            logger.error('Failed', error);
        }
    });
    done();
};

module.exports = consumer;
