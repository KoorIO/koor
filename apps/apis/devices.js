'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    q = require('../queues'),
    os = require('os'),
    utils = require('../helpers/utils'),
    services = require('../services'),
    logger = require('../helpers/logger'),
    router = express.Router();

// create a new device
router.post('/create', function(req, res) {
    logger.debug('Create a New Device', req.body.name);
    var device = new db.Device({
        name: req.body.name,
        projectId: req.body.projectId,
        description: req.body.description,
        fileId: req.body.fileId,
        albumId: req.body.albumId
    });
    device.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Device', error);
            return res.status(406).send(JSON.stringify({error}));
        }
        q.create(os.hostname() + 'devices', {
            type: 'CREATE_DEVICE',
            device: device,
            accessToken: req.body.accessToken,
            userId: req.body.userId
        }).priority('high').save();
        res.send(JSON.stringify(device));
    });
});

// get list of devices
router.get('/list/:projectId/:page/:limit', function(req, res) {
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Device.count({ projectId: req.params.projectId }, function(err, c) {
        db.Device
        .find({
            projectId: req.params.projectId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(devices) {
            if (err) {
                throw true;
            }
            var fileIds = [];
            var rows = [];
            for (var k in devices) {
                var device = devices[k].toObject();
                rows.push(device);
                if (device.fileId) {
                    fileIds.push(device.fileId);
                }
            }
            var ret = {
                count: c,
                rows: rows
            };
            services.File.getFileByIds({
                fileIds: fileIds,
                accessToken: req.body.accessToken
            }).then(function(body) {
                body.files.forEach(function(item) {
                    for (var i in rows) {
                        if (item._id == rows[i].fileId) {
                            rows[i].file = item;
                        }
                    }

                });
                ret.rows = rows;
                res.json(ret);
            }).catch(function() {
                res.json(ret);
            });
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

// get a device by id
router.get('/get/:id', function(req, res, next) {
    logger.debug('Get device By Id', req.params.id);
    db.Device.findOne({
        _id: req.params.id
    }).then(function(device) {
        device = device.toObject();
        if (device.fileId) {
            services.File.getFileById({
                fileId: device.fileId,
                accessToken: req.body.accessToken
            }).then(function(body) {
                device.file = body;
                res.json(device);
            }).catch(function(e) {
                logger.debug('Failed - get files', e);
                return next(e);
            });
        } else {
            res.json(device);
        }
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a device by id
router.delete('/delete/:id', function(req, res) {
    logger.debug('Delete Device By Id', req.params.id);
    db.Device.findOneAndRemove({
        _id: req.params.id
    }).then(function(device) {
        q.create(os.hostname() + 'devices', {
            type: 'DELETE_DEVICE',
            device: device,
            accessToken: req.body.accessToken,
            userId: req.body.userId
        }).priority('high').save();
        res.json(device);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// update a device by id
router.put('/update/:id', function(req, res) {
    logger.debug('Update Device By Id', req.params.id);
    db.Device.findOne({
        _id: req.params.id
    }).then(function(device) {
        device.name = req.body.name;
        device.description = req.body.description;
        device.fileId = req.body.fileId;
        device.albumId = req.body.albumId;
        device.save(function() {
            q.create(os.hostname() + 'devices', {
                type: 'UPDATE_DEVICE',
                device: device,
                accessToken: req.body.accessToken,
                userId: req.body.userId
            }).priority('high').save();
            res.json({});
        });
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// follow a device
router.post('/follow/:id', function(req, res) {
    logger.debug('Follow a Device', req.params.id);
    db.Device.findOne({
        _id: req.params.id
    }).then(function(device) {
        var followDevice = db.FollowDevice({
            userId: req.body.userId,
            deviceId: req.params.id
        });
        followDevice.save(function(e) {
            if (e) {
                throw true;
            }
            q.create(utils.getHostnameSocials() + 'notifications', {
                type: 'FOLLOW_DEVICE',
                id: device._id,
                userId: device.userId,
                data: followDevice
            }).priority('high').save();
            q.create(os.hostname() + 'followDevices', {
                userId: req.body.userId,
                deviceId: req.params.id
            }).priority('high').save();
            res.json(device);
        });
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});


module.exports = router;
