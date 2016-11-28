'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// get chat
router.get('/get/:id', function(req, res){
    logger.info('Get Chat Details', req.params.id);
    db.Chat
    .findOne({
        _id: req.params.id
    })
    .then(function(chat) {
        var ret = chat.toObject();
        res.json(ret);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

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
    var chat = new db.Chat({
        groupId: req.body.groupId,
        userId: req.body.userId,
        message: req.body.message
    });
    chat.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Chat', error);
            return res.status(500).json(error);
        } else {
            return res.json(chat);
        }
    });
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
