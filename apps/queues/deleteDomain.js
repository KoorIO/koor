'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var request = require('request');
consumer.name = os.hostname() + 'delete_domain';

consumer.task = function(job, done) {
  var data = job.data;
  if (config.get('cloudflare.enable')) {
    var options = {
      url: 'https://api.cloudflare.com/client/v4/zones/' + config.get('cloudflare.zone_id') + '/dns_records/' + data.dnsId,
      method: 'DELETE',
      json: true,
      headers: {
        'X-Auth-Email': config.get('cloudflare.email'),
        'X-Auth-Key': config.get('cloudflare.api_key'),
        'Content-Type': 'application/json'
      },
      body: {}
    };
    request(options, function(error, httpResponse, body) {
      if (error || httpResponse.statusCode !== 200) {
        logger.error('Failed - Delete domain httpResponse %s DNS ID %s', httpResponse.statusCode, data.dnsId);
      } else {
        logger.info('Deleted DNS ID %s domain %s', data.domain, body.result.id);
      }
    });
  }
  done();
};

module.exports = consumer;
