'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// run a new api
router.all('/:projectUrl', function(req, res){
    logger.debug('Get Api Docs %s', req.params.projectUrl);
    db.Project.findOne({
        api: req.params.projectUrl
    }, function(error, p){
        if (error) {
            return res.status(406).json({});
        } else {
            db.Api.find({
                projectId: p._id
            }, function(error, apis) {
                try {
                    if (error) {
                        throw true;
                    } else {
                        return res.json(apis.toObject());
                    }
                } catch(e) {
                    return res.status(406).json({});
                }
            });
        }
    });
});

module.exports = router;
