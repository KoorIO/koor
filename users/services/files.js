'user strict';
var request = require('request');
var utils = require('../helpers/utils');
var q = require('q');
var logger = require('../helpers/logger');
var config = require('config');

var getFileById = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.files.get'), { fileId: data.fileId });
    logger.info('Call service', url);
    request({
        url: url,
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err) {
            deferred.reject(e);
        }
        deferred.resolve(JSON.parse(body));
    });
    return deferred.promise;
};

var getFileByIds = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.files.getByIds'), {fileIds: data.fileIds});
    logger.info('Call service', url);
    request({
        url: url,
        method: 'GET',
        qs: {},
        headers: {
            'Authorization': data.accessToken
        }
    }, function(err, res, body) {
        if (err) {
            deferred.reject(e);
        }
        deferred.resolve(JSON.parse(body));
    });
    return deferred.promise;
};

module.exports = {
    serviceName: 'File',
	getFileById: getFileById,
	getFileByIds: getFileByIds
};
