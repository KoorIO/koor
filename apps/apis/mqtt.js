'use strict';
var express = require('express'), 
    logger = require('../helpers/logger'),
    db = require('../models'),
    q = require('../queues'),
    os = require('os'),
    router = express.Router();

// auth on register
router.post('/auth_on_register', function(req, res){
    logger.debug('Auth On Register');
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        req.rawBody += chunk;
        res.send(JSON.stringify({result: 'ok'}));
    });
});

// auth on subscribe
router.post('/auth_on_subscribe', function(req, res){
    req.setEncoding('utf8');
    logger.debug('Auth On Subscribe');
    req.on('data', function(data) {
        var topics = JSON.parse(data);
        var domains = [];
        for (var k in topics.topics) {
            var topic = topics.topics[k].topic;
            domains.push(topic.split('/')[0]);
        }
        db.Project.count({
            domain: { '$in': domains }
        }, function(error, count) {
            if (count < domains.length) {
                res.send(JSON.stringify({result: {error: 'You listen on unallowed channel'}}));
            } else {
                logger.debug('OK!');
                res.send(JSON.stringify({result: 'ok'}));
            }
        });

    });
});

// auth on publish
router.post('/auth_on_publish', function(req, res){
    logger.debug('Auth On Publish');
    req.setEncoding('utf8');

    req.on('data', function(data) {
        data = JSON.parse(data);
        var topics = data.topic.split('/');
        var domain = topics[0];
        db.Project.findOne({
            domain: domain
        }, function(error, p) {
            if (error || !p) {
                res.send(JSON.stringify({result: {error: 'You publish on unallowed channel'}}));
            } else {
                if (topics.length > 1) {
                    // send message store data to queue
                    var payload = {};
                    payload[topics[1]] = data.payload;
                    q.create(os.hostname() + 'store_data', {
                        projectId: p._id,
                        domain: domain,
                        query: {},
                        body: {},
                        payload: payload
                    }).priority('high').save();
                }
                logger.debug('OK!');
                res.send(JSON.stringify({result: 'ok'}));
            }
        });
    });
});

module.exports = router;
