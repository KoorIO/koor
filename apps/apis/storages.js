'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    moment = require('moment'),
    router = express.Router();

// get data by filed Id
router.get('/:fieldId', function(req, res){
    logger.info('Get Data for Field last 500 record', req.params.fieldId);
    db.Storage.find({ 
        fieldId: req.params.fieldId
    })
    .limit(500) // limit for first version 
    .sort({'_id': 'asc'})
    .then(function(data) {
        res.json(data);
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

// get data by filed code
router.get('/field/:fieldCode/:page', function(req, res){
    var limit = 100;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.info('Get Data for Field by Field Code', req.params.fieldCode);
    db.Field.findOne({
        projectId: req.body.projectId
    }).then(function(f) {
        db.Storage.find({ 
            fieldId: f._id
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'asc'})
        .then(function(data) {
            res.json({
                rows: data,
                page: req.params.page,
                limit: limit
            });
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

module.exports = router;
