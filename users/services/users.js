'user strict';
var request = require('request');
var utils = require('../helpers/utils');
var q = require('q');
var config = require('config');

var getUserById = function(data) {
    var deferred = q.defer();
    request({
        url: utils.makeUrl(config.get('services.users.get'), { userId: data.userId }),
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err) {
            deferred.reject(e);
        }
        deferred.resolve(err, JSON.parse(body));
    });
    return deferred.promise;
};

module.exports = {
    serviceName: 'User',
	getUserById: getUserById
};
