'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var request = require('request');
var db = require('../models');
consumer.name = os.hostname() + 'create_domain';

consumer.task = function(job, done){
    var data = job.data;
    if (config.get('cloudflare.enable')) {
        var options = {
            url: 'https://api.cloudflare.com/client/v4/zones/' + config.get('cloudflare.zone_id') + '/dns_records',
            method: 'POST',
            json: true,
            headers: {
                'X-Auth-Email': config.get('cloudflare.email'),
                'X-Auth-Key': config.get('cloudflare.api_key'),
                'Content-Type': 'application/json'
            },
            body: {
                'type': 'A',
                'name': data.projectId,
                'content': config.get('cloudflare.ip'),
                'proxied': true,
                'ttl': 1
            }
        };
        request(options, function(error, httpResponse, body) {
            if (error) {
                logger.error('Failed - A record for domain httpResponse', httpResponse);
            } else {
                logger.info('Created new A record for domain', body.result.name);
                db.Project.findOne({
                    _id: data.projectId
                }).then(function(project) {
                    project.dnsId = body.result.id;
                    project.save(function() {
                        logger.debug('Saved CloudFlare DNS record ID to Project DB', body.result.id);
                    })
                }).catch(function(e){
                    logger.error('Failed - CloudFlare DNS record ID into Project DB', body.result.id);
                });
            }
        });
    }
    done();
};

module.exports = consumer;
