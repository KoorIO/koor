'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// get feel
router.get('/get/:id', function(req, res){
    logger.info('Get Feel Details', req.params.id);
    db.Feel
    .findOne({
        _id: req.params.id
    })
    .then(function(feel) {
        var ret = feel.toObject();
        res.json(ret);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

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
                throw true;
            }
            var ret = {
                count: c,
                rows: feels
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(500).json(e);
        });
    });
});

// Create new feel
router.post('/create', function(req, res){
    logger.info('Create New Feel', req.body.objectId, req.body.objectType);
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
router.delete('/delete/:id', function(req, res) {
    logger.debug('Delete Feel By Id', req.params.id);
    db.Feel.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(feel) {
        res.json(feel);
    }).catch(function(e) {
        res.status(500).json(e);
    });
});

module.exports = router;
