'user strict';
var request = require('request');
var utils = require('../helpers/utils');
var logger = require('../helpers/logger');
var q = require('q');
var config = require('config');

var getPostById = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.posts.get'), { postId: data.postId });
    logger.debug('Get', url);
    request({
        url: url,
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(JSON.parse(body));
    });
    return deferred.promise;
};

module.exports = {
    serviceName: 'Post',
    getPostById: getPostById
};
