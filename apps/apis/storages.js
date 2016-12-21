'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
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

module.exports = router;
