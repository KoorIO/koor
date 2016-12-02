'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    utils = require('../helpers/utils'),
    services = require('../services'),
    os = require('os'),
    router = express.Router();

// get list feels
router.get('/list/:objectType/:objectId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Feel.count({
        objectId: req.params.objectId,
        objectType: req.params.objectType
    }, function(err, c) {
        db.Feel
        .find({
            objectId: req.params.objectId,
            objectType: req.params.objectType
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(feels) {
            if (err) {
                console.log('nnnn', err);
                throw true;
            }
            var userIds = [];
            var rows = [];
            for (var i in feels) {
                var feel = feels[i].toObject();
                rows.push(feel);
                userIds.push(feels[i].userId);
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
            console.log('bb',e);
            res.status(500).json(e);
        });
    });
});

// Create new feel
router.post('/create', function(req, res){
    logger.info('Create New Feel', req.body.objectId, req.body.objectType, req.body.feelType);
    var feel = new db.Feel({
        objectType: req.body.objectType,
        objectId: req.body.objectId,
        userId: req.body.userId,
        feelType: req.body.feelType
    });
    feel.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Feel', error);
            return res.status(500).json(error);
        } else {
            return res.json(feel);
        }
    });
});

// delete a feel by id
router.delete('/delete', function(req, res) {
    logger.info('Delete Feel', req.body.objectId, req.body.objectType);
    db.Feel.findOneAndRemove({
        userId: req.body.userId,
        objectId: req.body.objectId,
        objectType: req.body.objectType
    }).then(function(feel) {
        res.json(feel);
    }).catch(function(e) {
        res.status(500).json(e);
    });
});

module.exports = router;
