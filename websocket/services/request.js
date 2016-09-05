'use strict';
var config = require('config');
var q = require('q');
var request = require('request');
var logger = require('../helpers/logger');

// auth
function auth(){
    var defer = q.defer();
    var url = config.get('services.auth');

    logger.debug('Request to url', url);
    request.get({
        url: url, 
        headers: {},
        json:true
    }, function (err, res, body) {
        if(err || res.statusCode !== 200){
            logger.error("Get Object Data failed: ", err);
            defer.reject(err);
        } else {
            defer.resolve(body);
        }


    })
    return defer.promise;
}

module.exports = {
    'auth': auth
};
