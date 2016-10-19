'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// get data of field
router.all('/:projectUrl/field/:fieldCode/:page', function(req, res, next){
    var limit = 100;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.info('Get Data for Field by Field Code', req.params.fieldCode, req.params.projectUrl);
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
            res.status(400).send(JSON.stringify(e));
        });
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

module.exports = router;
