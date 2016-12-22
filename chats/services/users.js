'user strict';
var request = require('request');
var utils = require('../helpers/utils');
var logger = require('../helpers/logger');
var q = require('q');
var config = require('config');

var getFollowingsByUserId = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.users.getFollowingsByUserId'), { userId: data.userId , page: 1, limit: 2000});
    logger.debug('Get', url);
    request({
        url: url,
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err || res.statusCode !== 200) {
            deferred.reject(true);
        } else {
            deferred.resolve(JSON.parse(body));
        }
    });
    return deferred.promise;
};

var getUserById = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.users.getUserById'), { userId: data.userId });
    logger.debug('Get', url);
    request({
        url: url,
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err || res.statusCode !== 200) {
            deferred.reject(true);
        } else {
            deferred.resolve(JSON.parse(body));
        }
    });
    return deferred.promise;
};

var getUsersByIds = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.users.getUsersByIds'), { userIds: data.userIds.join() });
    logger.debug('Get', url);
    request({
        url: url,
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err || res.statusCode !== 200) {
            deferred.reject(true);
        } else {
            deferred.resolve(JSON.parse(body));
        }
    });
    return deferred.promise;
};

module.exports = {
    serviceName: 'User',
    getFollowingsByUserId: getFollowingsByUserId,
    getUsersByIds: getUsersByIds,
    getUserById: getUserById
};
