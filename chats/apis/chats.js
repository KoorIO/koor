'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    utils = require('../helpers/utils'),
    services = require('../services'),
    os = require('os'),
    router = express.Router();

// get list chats
router.get('/list/:groupId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Chat.count({
        groupId: req.params.groupId
    }, function(err, c) {
        db.Chat
        .find({
            groupId: req.params.groupId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(chats) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: chats
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(500).json(e);
        });
    });
});

// Create new chat
router.post('/create', function(req, res){
    logger.info('Create New Chat', req.body.objectId, req.body.objectType);
    var groupId = req.body.groupId || utils.makeUniqueGroupId({
        from: {
            objectType: 'USER',
            objectId: req.body.userId
        },
        to: {
            objectType: req.body.objectType,
            objectId: req.body.objectId
        }
    });
    db.GroupChat.findOne({
        groupId: groupId
    }).then(function(gc) {
        if (gc) {
            saveMessage();
        } else {
            if (req.body.objectType === 'USER') {
                services.User.getUserById({
                    userId: req.body.objectId,
                    accessToken: req.body.accessToken
                }).then(function(user) {
                    db.GroupChat.insertMany([{
                        groupId: groupId,
                        name: req.user.firstname + ' ' + req.user.lastname,
                        objectId: req.body.objectId,
                        objectType: req.body.objectType
                    }, {
                        groupId: groupId,
                        name: user.firstname + ' ' + user.lastname,
                        objectId: req.body.userId,
                        objectType: 'USER'
                    }], function(error, chatMembers) {
                        saveMessage();
                    });
                });
            }
            if (req.body.objectType === 'DEVICE') {
                services.Device.getDeviceById({ 
                    deviceId: req.body.objectId,
                    accessToken: req.body.accessToken
                }).then(function(device) {
                    db.GroupChat.insertMany([{
                        groupId: groupId,
                        name: req.user.firstname + ' ' + req.user.lastname,
                        objectId: req.body.objectId,
                        objectType: req.body.objectType
                    }, {
                        groupId: groupId,
                        name: device.name,
                        objectId: req.body.userId,
                        objectType: 'USER'
                    }], function(error, chatMembers) {
                        saveMessage();
                    });
                });
            }
        }
    });
    function saveMessage() {
        var chat = new db.Chat({
            groupId: groupId,
            objectId: req.body.objectId,
            objectType: req.body.objectType,
            message: req.body.message
        });
        chat.save(function(error) {
            if (error) {
                logger.debug('Failed - Save Chat', error);
                return res.status(500).json(error);
            } else {
                db.GroupChat.update({
                    groupId: groupId
                }, {status: 'unread'}, function(err, numberAffected, rawResponse) {
                    logger.debug('Unread', numberAffected, err);
                });
                return res.json(chat);
            }
        });
    }
});

// Update chat
router.put('/update/:id', function(req, res) {
    logger.debug('Update Chat By Id', req.params.id);
    db.Chat.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(chat) {
        chat.message = req.body.message;
        chat.save(function() {
            res.json(chat);
        })
    }).catch(function(e){
        res.status(400).send(JSON.stringify(e));
    });
});

// delete a chat by id
router.delete('/delete/:id', function(req, res) {
    logger.debug('Delete Chat By Id', req.params.id);
    db.Chat.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(chat) {
        res.json(chat);
    }).catch(function(e) {
        res.status(400).json(e);
    });
});


module.exports = router;
