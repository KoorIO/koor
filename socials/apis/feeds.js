'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    s = require('../services'),
    router = express.Router();

// get list of notifications
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.info('Get Feed User', req.body.userId);
    s.User.getFollowingsByUserId({
        userId: req.body.userId,
        accessToken: req.body.accessToken
    }).then(function(followings) {
        var friendIds = [];
        for (var i in followings.rows) {
            friendIds.push(followings.rows[i]._id);
        }
        friendIds.push(req.body.userId);
        db.Feed
        .find({
            userId: {$in: friendIds}
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(feeds) {
            var ret = {
                rows: feeds
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(400).send(JSON.stringify(e));
        });

    })
});

// get new feeds
router.get('/newer/:feedId/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    logger.info('Get New Feed User', req.params.feedId);
    s.User.getFollowingsByUserId({
        userId: req.body.userId,
        accessToken: req.body.accessToken
    }).then(function(followings) {
        var friendIds = [];
        for (var i in followings.rows) {
            friendIds.push(followings.rows[i]._id);
        }
        db.Feed
        .find({
            _id: {$gt: req.params.feedId},
            userId: {$in: friendIds}
        })
        .skip(0)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(feeds) {
            var ret = {
                rows: feeds
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(400).send(JSON.stringify(e));
        });

    })
});

module.exports = router;
