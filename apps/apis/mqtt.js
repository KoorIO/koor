'use strict';
var express = require('express'),
    logger = require('../helpers/logger'),
    db = require('../models/mongodb'),
    q = require('../queues'),
    cache = require('../helpers/cache'),
    os = require('os'),
    router = express.Router();

// auth on register
router.post('/auth_on_register', function(req, res) {
    logger.debug('MQTT Auth On Register');
    req.setEncoding('utf8');

    req.on('data', function(d) {
        var data = JSON.parse(d);
        logger.debug('Username', data.username);
        res.send(JSON.stringify({result: 'ok'}));
    });
});

// auth on subscribe
router.post('/auth_on_subscribe', function(req, res) {
    req.setEncoding('utf8');
    logger.debug('MQTT Auth On Subscribe');
    req.on('data', function(data) {
        var topics = JSON.parse(data);
        var domains = [];
        for (var k in topics.topics) {
            var topic = topics.topics[k].topic;
            // allow koor.io/timer
            if (topic === 'koor.io/timer') {
                return res.send(JSON.stringify({result: 'ok'}));
            }
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
router.post('/auth_on_publish', function(req, res) {
    logger.debug('MQTT Auth On Publish');
    req.setEncoding('utf8');

    req.on('data', function(d) {
        var data = JSON.parse(d);
        // allow koor.io/timer
        if (data.topic === 'koor.io/timer') {
            return res.send(JSON.stringify({result: 'ok'}));
        }
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
                return res.send(JSON.stringify({result: 'ok'}));
            }
        });
    });
});

// on subscribe
router.post('/on_subscribe', function(req, res) {
    logger.debug('MQTT On Subscribe');
    req.setEncoding('utf8');

    req.on('data', function(d) {
        var data = JSON.parse(d);
        logger.debug('Subscriber Id', data.subscriber_id);
        data.topics.forEach(function(topic) {
            logger.debug('Topic', topic.topic);
            if (topic.topic.match(/^(.*)\.koor.io\/devices\/(.*)/g)) {
                var arrTopic = topic.topic.split('/');
                var deviceId = arrTopic[2];
                var domain = arrTopic[0];
                db.Device.findOne({
                    _id: deviceId
                }).then(function(device) {
                    device.status = true;
                    device.subscriberId = data.subscriber_id;
                    device.save(function() {
                        cache.publish('device_data', JSON.stringify({
                            status: device.status,
                            domain: domain,
                            deviceId: device._id
                        }));
                        // save activity
                        db.Project.findOne({
                            domain: domain
                        }).then(function(project) {
                            if (project) {
                                q.create(os.hostname() + 'appNotifications', {
                                    userId: project.userId,
                                    type: 'DEVICE_ON',
                                    data: device
                                }).priority('high').save();
                                q.create(os.hostname() + 'activities', {
                                    projectId: project._id,
                                    userId: project.userId,
                                    type: 'DEVICE_ON',
                                    data: {
                                        _id: device._id,
                                        name: device.name
                                    }
                                }).priority('low').save();
                            }
                        });
                        logger.debug('Device %s is ON', deviceId);
                    });
                }).catch(function() {});
            }
        });
        res.send(JSON.stringify({result: 'ok'}));
    });
});

// on client gone
router.post('/on_client_gone', function(req, res) {
    logger.debug('MQTT On Client Gone');
    req.setEncoding('utf8');

    req.on('data', function(d) {
        var data = JSON.parse(d);
        logger.debug('Subscriber Id', data.subscriber_id);
        db.Device.findOne({
            subscriberId: data.subscriber_id
        }).then(function(device) {
            device.status = false;
            device.save(function() {
                db.Project.findOne({
                    _id: device.projectId
                }).then(function(p) {
                    cache.publish('device_data', JSON.stringify({
                        status: device.status,
                        domain: p.domain,
                        deviceId: device._id
                    }));
                    // save activiry
                    q.create(os.hostname() + 'appNotifications', {
                        userId: p.userId,
                        type: 'DEVICE_OFF',
                        data: device
                    }).priority('high').save();
                    q.create(os.hostname() + 'activities', {
                        projectId: p._id,
                        userId: p.userId,
                        type: 'DEVICE_OFF',
                        data: {
                            _id: device._id,
                            name: device.name
                        }
                    }).priority('low').save();
                    logger.debug('Device %s is OFF', device._id);
                });
            });

        });
        res.send(JSON.stringify({result: 'ok'}));
    });
});

// on client offline
router.post('/on_client_offline', function(req, res) {
    logger.debug('MQTT On Client Offline');
    req.setEncoding('utf8');

    req.on('data', function(d) {
        var data = JSON.parse(d);
        logger.debug('Subscriber Id', data.subscriber_id);
        db.Device.findOne({
            subscriberId: data.subscriber_id
        }).then(function(device) {
            device.status = false;
            device.save(function() {
                db.Project.findOne({
                    _id: device.projectId
                }).then(function(p) {
                    cache.publish('device_data', JSON.stringify({
                        status: device.status,
                        domain: p.domain,
                        deviceId: device._id
                    }));
                    q.create(os.hostname() + 'appNotifications', {
                        userId: p.userId,
                        type: 'DEVICE_OFF',
                        data: device
                    }).priority('high').save();
                    q.create(os.hostname() + 'activities', {
                        projectId: p._id,
                        userId: p.userId,
                        type: 'DEVICE_OFF',
                        data: {
                            _id: device._id,
                            name: device.name
                        }
                    }).priority('low').save();
                    logger.debug('Device %s is OFF', device._id);
                });
            });
        });
        res.send(JSON.stringify({result: 'ok'}));
    });
});


module.exports = router;
