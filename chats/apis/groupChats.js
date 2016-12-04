'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// get groupChat
router.get('/get/:id', function(req, res){
    logger.info('Get GroupChat Details', req.params.id);
    db.GroupChat
    .findOne({
        _id: req.params.id
    })
    .then(function(groupChat) {
        var ret = groupChat.toObject();
        res.json(ret);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// get list groupChats
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.GroupChat.count({
        objectId: req.body.userId,
        objectType: 'USER'
    }, function(err, c) {
        db.GroupChat
        .find({
            objectId: req.body.userId,
            objectType: 'USER'
        })
        .skip(skip)
        .limit(limit)
        .sort({'updatedAt': 'desc'})
        .populate('group', 'name')
        .then(function(chatMembers) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: chatMembers
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(400).json(e);
        });
    });
});

// Create new groupChat
router.post('/create', function(req, res){
    logger.info('Create New GroupChat', req.body.userId, req.body.name);
    var userIds = (!req.body.friendId)?[req.body.userId]:[req.body.userId, req.body.friendId];
    var groupChat = new db.GroupChat({
        userIds: [req.body.userId],
        name: req.body.name,
        description: req.body.description
    });
    groupChat.save(function(error) {
        if (error) {
            logger.debug('Failed - Save GroupChat', error);
            return res.status(500).json(error);
        } else {
            return res.json(groupChat);
        }
    });
});

// Update groupChat
router.put('/update/:id', function(req, res) {
    logger.debug('Update GroupChat By Id', req.params.id);
    db.GroupChat.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(groupChat) {
        groupChat.name = req.body.name;
        groupChat.description = req.body.description;
        groupChat.save(function() {
            res.json(groupChat);
        })
    }).catch(function(e){
        res.status(400).send(JSON.stringify(e));
    });
});

// delete a groupChat by id
router.delete('/delete/:id', function(req, res) {
    logger.debug('Delete GroupChat By Id', req.params.id);
    db.GroupChat.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(groupChat) {
        res.json(groupChat);
    }).catch(function(e) {
        res.status(500).json(e);
    });
});


module.exports = router;
