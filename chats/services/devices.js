'user strict';
var request = require('request');
var utils = require('../helpers/utils');
var logger = require('../helpers/logger');
var q = require('q');
var config = require('config');

var getDeviceById = function(data) {
    var deferred = q.defer();
    var url = utils.makeUrl(config.get('services.devices.getDeviceById'), { deviceId: data.deviceId });
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
    serviceName: 'Device',
    getDeviceById: getDeviceById
};
