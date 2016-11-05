'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models');
var dns = require('dns');
var config = require('config');
consumer.name = os.hostname() + 'dnsresolve';

consumer.task = function(job, done){
    var data = job.data;
     
    if (config.get('cloudflare.enable') === "false" || !config.get('cloudflare.enable')) {
        logger.debug('CloudFlare is disable', data.projectId);
        db.Project.findOne({
            _id: data.projectId
        }).then(function(project) {
            project.dnsStatus = true;
            project.save(function() {
                var notification = {
                    type: 'DNS_RESOLVED',
                    userId: project.userId,
                    data: project
                };
                var q = require('../queues');
                q.create(os.hostname() + 'notifications', notification).priority('high').save();
                var activity = {
                    type: 'DNS_RESOLVED',
                    userId: project.userId,
                    projectId: project._id,
                    data: project
                };
                q.create(os.hostname() + 'activities', notification).priority('low').save();
                logger.debug('Domain %s works', project.domain);
            });
        }).catch(function(e){
            logger.debug('Failed - Update DNS Status for Project', project.domain);
        });
    } else {
        dns.resolve4(data.domain, function (err, addresses) {
            if (err) {
                logger.debug('Domain %s does not work yet', data.domain);
                return done();
            }

            db.Project.findOne({
                _id: data.projectId
            }).then(function(project) {
                project.dnsStatus = true;
                project.save(function() {
                    var notification = {
                        type: 'DNS_RESOLVED',
                        userId: project.userId,
                        data: project
                    };
                    var q = require('../queues');
                    q.create(os.hostname() + 'notifications', notification).priority('high').save();
                    var activity = {
                        type: 'DNS_RESOLVED',
                        userId: project.userId,
                        projectId: project._id,
                        data: project
                    };
                    q.create(os.hostname() + 'activities', notification).priority('low').save();
                    logger.debug('Domain %s works', project.domain);
                });
            }).catch(function(e){
                logger.debug('Failed - Update DNS Status for Project', project.domain);
            });

        });
    }
    done();
};

module.exports = consumer;
