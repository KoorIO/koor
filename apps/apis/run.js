'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// run a new api
router.all('/:projectUrl/:apiPath', function(req, res){
    logger.debug('Run a Api %s %s', req.params.projectUrl, req.params.apiPath);
    db.Project.findOne({
        api: req.params.projectUrl
    }, function(error, p){
        if (error) {
            return res.status(406).json({});
        } else {
            db.Api.findOne({
                path: req.params.apiPath
            }, function(error, a) {
                try {
                    if (error) {
                        throw true;
                    } else {
                        if (req.method !== a.method) {
                            throw true;
                        } else {
                            logger.debug('Perfect Request %s %s %s', req.params.projectUrl, req.params.apiPath, a.response.status);
                            res.set(a.response.headers);
                            res.status(a.response.status).send(JSON.stringify(a.response.body));
                        }
                    }
                } catch(e) {
                    return res.status(406).json({});
                }
            });
        }
    });
});

module.exports = router;
