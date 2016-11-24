'project strict';
var request = require('request');
var utils = require('../helpers/utils');
var q = require('q');
var config = require('config');

var getProjectById = function(data) {
    var deferred = q.defer();
    request({
        url: utils.makeUrl(config.get('services.projects.get'), { projectId: data.projectId }),
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
    serviceName: 'Project',
	getProjectById: getProjectById
};
