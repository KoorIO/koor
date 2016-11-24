'device strict';
var request = require('request');
var utils = require('../helpers/utils');
var q = require('q');
var config = require('config');

var getDeviceById = function(data) {
    var deferred = q.defer();
    request({
        url: utils.makeUrl(config.get('services.devices.get'), { deviceId: data.deviceId }),
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
    serviceName: 'Device',
	getDeviceById: getDeviceById
};
