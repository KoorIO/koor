'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    sanitize = require("sanitize-filename"),
    os = require('os'),
    router = express.Router();

// get file
router.get('/:userId/:albumId/:fileId/:fileName', function(req, res){
    var filePath = path.join(__dirname, '/../uploads/', sanitize(req.params.userId),
                             sanitize(req.params.albumId), sanitize(req.params.fileId + '-' + req.params.fileName));
    res.sendFile(filePath);
});

module.exports = router;
