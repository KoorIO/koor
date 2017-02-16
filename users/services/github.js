'user strict';
var request = require('request');
var q = require('q');
var logger = require('../helpers/logger');

var getUserInfo = function(data) {
  var deferred = q.defer();
  var url = 'https://api.github.com/user';
  logger.debug('Get User info from github', url);
  request.get({
    url: url,
    qs: { 'access_token': data['access_token'] },
    json: true,
    headers: { 'User-Agent': '' }
  }, function(err, res, body) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(body);
  });
  return deferred.promise;
};

var getEmails = function(data) {
  var deferred = q.defer();
  var url = 'https://api.github.com/user/emails';
  logger.debug('Get User info from github', url);
  request.get({
    url: url,
    qs: { 'access_token': data['access_token'] },
    json: true,
    headers: { 'User-Agent': '' }
  }, function(err, res, body) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(body);
  });
  return deferred.promise;
};

module.exports = {
  serviceName: 'Github',
  getUserInfo,
  getEmails
};
