'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    utils = require('../helpers/utils'),
    logger = require('../helpers/logger'),
    router = express.Router();

// create a new device
router.post('/create', function(req, res) {
    logger.debug('Create a New Device', req.body.name);
    var device = new db.Device({
        name: req.body.name,
        projectId: req.body.projectId,
        description: req.body.description
    });
    device.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Device', error);
            return res.status(406).send(JSON.stringify({error}));
        }
        res.send(JSON.stringify(device));
    });
});

// get list of devices
router.get('/list/:projectId/:page/:limit', function(req, res){
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
            var ret = {
                count: c,
                rows: devices
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

// get a device by id
router.get('/get/:id', function(req, res){
    logger.debug('Get device By Id', req.params.id);
    db.Device.findOne({
        _id: req.params.id
    }).then(function(device) {
        res.json(device);
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a device by id
router.delete('/delete/:id', function(req, res){
    logger.debug('Delete Device By Id', req.params.id);
    db.Device.findOneAndRemove({
        _id: req.params.id
    }).then(function(){
        res.json({});
    }).catch(function(e){
        res.status(400).send(JSON.stringify(e));
    });
});

// update a device by id
router.put('/update/:id', function(req, res){
    logger.debug('Update Device By Id', req.params.id);
    db.Device.findOne({
        _id: req.params.id
    }).then(function(device) {
        device.name = req.body.name;
        device.description = req.body.description;
        device.save(function() {
            res.json({});
        })
    }).catch(function(e){
        res.status(400).send(JSON.stringify(e));
    });
});

// follow a device
router.post('/follow/:id', function(req, res){
    logger.debug('Follow a Device', req.params.id);
    db.Device.findOne({
        _id: req.params.id
    }).then(function(device) {
        followDevice = db.FollowDevice({
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
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});


module.exports = router;
