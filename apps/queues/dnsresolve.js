'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models');
var dns = require('dns');
var q = require('../queues');
consumer.name = os.hostname() + 'dnsresolve';

consumer.task = function(job, done){
    var data = job.data;
     
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
                q.create(os.hostname() + 'notifications', notification).priority('high').save();
                logger.debug('Domain %s works', project.domain);
            });
        }).catch(function(e){
            logger.debug('Failed - Update DNS Status for Project', project.domain);
        });

    });
    done();
};

module.exports = consumer;
