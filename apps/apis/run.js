'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// run a new api
router.all('/:projectUrl/*', function(req, res) {
    logger.debug('Run a Api %s %s', req.params.projectUrl, req.params[0]);
    db.Project.findOne({
        domain: req.params.projectUrl
    }, function(error, p) {
        if (error) {
            logger.debug('Failed - Query Project', error);
            return res.status(406).json({});
        }
        db.Api.findOne({
            projectId: p._id,
            path: req.params[0]
        }, function(error, a) {
            try {
                if (error) {
                    logger.debug('Failed - Query API', error);
                    throw true;
                } else {
                    if (req.method.toLowerCase() !== a.method.toLowerCase()) {
                        logger.debug('Failed - Method does not match', req.method);
                        throw true;
                    } else {
                        logger.debug('Perfect Request %s %s %s', req.params.projectUrl, req.params[0], a.response.status);
                        res.set(a.response.headers);

                        // send message store data to queue
                        q.create(os.hostname() + 'storeData', {
                            projectId: a.projectId,
                            domain: req.params.projectUrl,
                            query: req.query,
                            body: req.body,
                            payload: {}
                        }).priority('high').removeOnComplete(true).save();

                        res.status(a.response.status).send(JSON.stringify(a.response.body));
                    }
                }
            } catch (e) {
                logger.debug('Failed - Somethings went wrong', e);
                return res.status(406).json({});
            }
        });
    });
});

module.exports = router;
