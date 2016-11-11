'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    moment = require('moment'),
    request = require('request'),
    config = require('config'),
    crypto = require('crypto'),
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
        q.create(os.hostname() + 'njFollows', {
            userId: req.body.followingId,
            followerId: req.body.userId
        }).priority('high').save();
        res.json(follower);
    });
});

// get list of followers
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Follower List', limit, skip);
    db.Follower.count({
        userId: req.body.userId
    }, function(err, c) {
        db.Follower
        .find({
            userId: req.body.userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(followers) {
            if (err) {
                throw {};
            }
            var ret = {
                count: c,
                rows: followers
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

// get list of following
router.get('/following/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Following List', limit, skip);
    db.Follower.count({
        followerId: req.body.userId
    }, function(err, c) {
        db.Follower
        .find({
            followerId: req.body.userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(followers) {
            if (err) {
                throw {};
            }
            var ret = {
                count: c,
                rows: followers
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
