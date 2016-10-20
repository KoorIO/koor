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
    db.Project.findOne({
        domain: req.params.projectUrl
    }, function(error, p){
        if (error || !p) {
            logger.debug('Failed - Query Project', error);
            return res.status(406).json({});
        } else {
            db.Field.findOne({
                projectId: p._id
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
                    logger.debug('Failed - Query Storages', e);
                    res.status(400).send(JSON.stringify(e));
                });
            }).catch(function(e) {
                logger.debug('Failed - Query Fields', e);
                res.status(400).send(JSON.stringify(e));
            });
        }
    });
});

module.exports = router;
