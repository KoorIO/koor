'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    moment = require('moment'),
    router = express.Router();

// get list of fields
router.get('/:fieldId', function(req, res){
    logger.info('Get Data for Field around 1 hours', req.params.fieldId);
    db.Storage.find({ 
        fieldId: req.params.fieldId,
        createdAt: { $gt: moment().add(-24*60*60, 'seconds') }
    }).then(function(data) {
        res.json(data);
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

module.exports = router;
