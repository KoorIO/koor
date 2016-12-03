'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    services = require('../services'),
    utils = require('../helpers/utils'),
    os = require('os'),
    router = express.Router();

// get comment
router.get('/get/:id', function(req, res){
    logger.info('Get Comment Details', req.params.id);
    db.Comment
    .findOne({
        _id: req.params.id
    })
    .then(function(comment) {
        var ret = comment.toObject();
        res.json(ret);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// get list comments
router.get('/list/:objectType/:objectId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Comment.count({
        objectId: req.params.objectId,
        objectType: req.params.objectType
    }, function(err, c) {
        db.Comment
        .find({
            objectId: req.params.objectId,
            objectType: req.params.objectType
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(comments) {
            if (err) {
                throw true;
            }
            var userIds = [];
            var rows = [];
            for (var i in comments) {
                var comment = comments[i].toObject();
                rows.push(comment);
                userIds.push(comments[i].userId);
            }
            var ret = {
                count: c,
                rows: rows
            };
            if (userIds.length > 0) {
                services.User.getUsersByIds({ userIds: userIds, accessToken: req.body.accessToken })
                    .then(function(users) {
                    rows = utils.mapUsersToObjects(users, rows);
                    res.json(ret);
                }).catch(function(e) {
                    res.status(500).json(e);
                });
            } else {
                res.json(ret);
            }
        }).catch(function(e) {
            console.log(e);
            res.status(500).json(e);
        });
    });
});

// Create new comment
router.post('/create', function(req, res){
    logger.info('Create New Comment', req.body.objectId, req.body.objectType);
    var comment = new db.Comment({
        objectType: req.body.objectType,
        objectId: req.body.objectId,
        userId: req.body.userId,
        message: req.body.message
    });
    comment.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Comment', error);
            return res.status(500).json(error);
        } else {
            return res.json(comment);
        }
    });
});

// Update comment
router.put('/update/:id', function(req, res) {
    logger.debug('Update Comment By Id', req.params.id);
    db.Comment.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(comment) {
        comment.message = req.body.message;
        comment.save(function() {
            res.json(comment);
        })
    }).catch(function(e){
        res.status(400).send(JSON.stringify(e));
    });
});

// delete a comment by id
router.delete('/delete/:id', function(req, res) {
    logger.debug('Delete Comment By Id', req.params.id);
    db.Comment.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(comment) {
        res.json(comment);
    }).catch(function(e) {
        res.status(400).json(e);
    });
});


module.exports = router;
