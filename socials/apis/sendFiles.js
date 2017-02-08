'use strict';
var express = require('express'),
  logger = require('../helpers/logger'),
  sanitize = require('sanitize-filename'),
  path = require('path'),
  fs = require('fs'),
  router = express.Router();

// get file
router.get('/:userId/:albumId/:fileName', function(req, res) {
  var filePath = path.join(__dirname, '/../uploads/', sanitize(req.params.userId),
                             sanitize(req.params.albumId), sanitize(req.params.fileName));
  logger.debug('Get', filePath);
  if (fs.existsSync(filePath)) {
    res.set({'Content-Type': 'image/jpg'});
    res.sendFile(filePath);
  } else {
    logger.debug('File Not Found');
    res.status(404).json({});
  }
});

module.exports = router;
