'use strict';
var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    logger = require('../../helpers/logger'),
    driver = require('../../helpers/neo4j');

var countMutualFriends = function(data) {
    var deferred = q.defer();
    var session = driver.session();
    session
    .run('MATCH (a:Users {userId: {aId}}) \
         WITH a LIMIT 1 \
         MATCH (b:Users {userId: {bId}}) \
         WITH b LIMIT 1 \
         MATCH (a)-[:FOLLOW]->(x) \
         MATCH (b)-[:FOLLOW]->(x) RETURN COUNT(x) AS c', {aId: data.aId, bId: data.bId})
    .then(function(result) {
        logger.debug('Count Mutual Friend', data.aId, data.bId);
        session.close();
        deferred.resolve(result);
    }).catch(function(error) {
        logger.error('Failed', error);
        deferred.reject(error);
    });
    return deferred.promise;
};

var peopleYouMayKnow = function(data) {
    var deferred = q.defer();
    var session = driver.session();
    session
    .run('MATCH (u:Users)-[:FOLLOW]->(f:Users)-[:FOLLOW]->(p:Users) \
        WHERE u.userId = {userId} AND not(u)-[:FOLLOW]->(p) AND p.userId <> {userId} RETURN DISTINCT p \
        SKIP {skip} \
        LIMIT {limit} \
        ', {userId: data.userId, limit: data.limit, skip: data.skip})
    .then(function(result) {
        var userIds = [];
        result.records.forEach(function(record) {
            userIds.push(record._fields[0].properties.userId);
        });
        session.close();
        deferred.resolve(userIds);
    }).catch(function(e) {
        logger.error('Failed', e);
        deferred.reject(e);
    });
    return deferred.promise;
}


module.exports = {
    modelName: 'User',
    countMutualFriends: countMutualFriends,
    peopleYouMayKnow: peopleYouMayKnow
}
