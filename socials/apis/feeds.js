'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// get list of notifications
router.get('/feedUser/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.info('Get Feed User', req.body.userId);
    db.FeeUser.count({ userId: req.body.userId }, function(err, c) {
        db.FeedUser
        .find({
            userId: req.body.userId
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
            res.json(ret);
        }).catch(function(e) {
            res.status(400).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
