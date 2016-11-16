'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    services = require('../services'),
    os = require('os'),
    router = express.Router();

// follow a user
router.post('/create', function(req, res){
    var follower = new db.Follower({
        userId: req.body.followingId,
        followerId: req.body.userId
    });
    logger.debug('User %s follows %s', req.body.userId, req.body.followingId);
    follower.save(function(error){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        q.create(os.hostname() + 'notifications', {
            type: 'FOLLOW_USER',
            userId: follower.userId,
            data: follower
        }).priority('high').save();
        q.create(os.hostname() + 'follows', {
            userId: req.body.followingId,
            followerId: req.body.userId
        }).priority('high').save();
        res.json(follower);
    });
});

// get list of followers
router.get(['/list/:page/:limit', '/list/:userId/:page/:limit'], function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    var userId = req.params.userId || req.body.userId;
    logger.debug('Follower List', limit, skip);
    db.Follower.count({
        userId: userId
    }, function(err, c) {
        db.Follower
        .find({
            userId: userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(followers) {
            if (err) {
                throw {};
            }
            var userIds = [];
            for (var j in followers) {
                userIds.push(followers[j].followerId);
            }
            db.User.find({
                _id: { $in: userIds }
            }).then(function(users){
                var fileIds = [];
                var rows = [];
                for (var k in users) {
                    // remove security attributes
                    var user = users[k].toObject();
                    delete user.hashed_password;
                    delete user.salt;
                    rows.push(user);
                    if (user.fileId) {
                        fileIds.push(user.fileId);
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
                            if (item.userId == rows[i]._id) {
                                rows[i].file = item;
                            }
                        }

                    });
                    ret.rows = rows;
                    res.send(JSON.stringify(ret));
                }).catch(function() {
                    res.send(JSON.stringify(ret));
                });
            }).catch(function(e){
                res.status(500).send(JSON.stringify(e));
            });
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

// get list of following
router.get(['/following/list/:page/:limit', '/following/list/:userId/:page/:limit'], function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    var userId = req.params.userId || req.body.userId;
    logger.debug('Following List', limit, skip);
    db.Follower.count({
        followerId: userId
    }, function(err, c) {
        db.Follower
        .find({
            followerId: userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(followers) {
            if (err) {
                throw {};
            }
            var userIds = [];
            for (var j in followers) {
                userIds.push(followers[j].userId);
            }
            db.User.find({
                _id: { $in: userIds }
            }).then(function(users){
                var fileIds = [];
                var rows = [];
                for (var k in users) {
                    // remove security attributes
                    var user = users[k].toObject();
                    delete user.hashed_password;
                    delete user.salt;
                    rows.push(user);
                    if (user.fileId) {
                        fileIds.push(user.fileId);
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
                            if (item.userId == rows[i]._id) {
                                rows[i].file = item;
                            }
                        }

                    });
                    ret.rows = rows
                    res.send(JSON.stringify(ret));
                }).catch(function() {
                    res.send(JSON.stringify(ret));
                });
            }).catch(function(e){
                res.status(500).send(JSON.stringify(e));
            });
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
