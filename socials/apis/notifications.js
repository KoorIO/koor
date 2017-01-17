'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    router = express.Router();

// get list of notifications
router.get('/list/:page/:limit', function(req, res) {
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.info('Get Notifications', req.body.userId);
    db.Notification.count({ userId: req.body.userId }, function(err, c) {
        db.Notification
        .find({
            userId: req.body.userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(notifications) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: notifications
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(400).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
