'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    fileHelper = require('../helpers/file'),
    os = require('os'),
    router = express.Router();

// get list of notifications
router.get('/:fileId', function(req, res){
    logger.info('Get File Details', req.params.fileId);
    db.File
    .findOne({
        _id: req.params.fileId
    })
    .then(function(file) {
        if (err) {
            throw true;
        }
        file.urls = fileHelper.filePathToUrls(file.filePath);
        res.json(file);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

module.exports = router;
