'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// get list of activities
router.get('/list/:projectId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.info('Get Activities', req.params.projectId);
    db.Activity.count({ projectId: req.params.projectId }, function(err, c) {
        db.Activity
        .find({
            projectId: req.params.projectId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(apis) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: apis
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(400).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
