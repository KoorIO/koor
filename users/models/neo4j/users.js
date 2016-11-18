'use strict';
var fs = require('fs'),
    path = require('path'),
    driver = require('../helpers/neo4j');

var countMutualFriends = function(data) {
    var deferred = q.defer();
    var session = driver.session();
    session
    .run('MATCH (a:Users {userId: {aId}}) \
         MATCH (b:Users {userId: {bId}}) \
         MATCH (a)-[:FOLLOW]->(x) \
         MATCH (b)-[:FOLLOW]->(x) RETURN COUNT(x)', {aId: data.aId, bId: data.bId})
    .subscribe({
        onCompleted: function(result) {
            logger.debug('Count Mutual Friend', data.aId, data.bId);
            session.close();
            deferred.resolve(result);
        },
        onError: function(error) {
            logger.error('Failed', error);
            deferred.reject(error);
        }
    });
    return deferred.promise;
};


module.exports = {
    modelName: 'User',
    countMutualFriends: countMutualFriends
}
