'use strict';
var express = require('express'),
  db = require('../models/mongodb'),
  logger = require('../helpers/logger'),
  fileHelper = require('../helpers/file'),
  router = express.Router();

// get file details
router.get('/get/:fileId', function(req, res) {
  logger.info('Get File Details', req.params.fileId);
  db.File
    .findOne({
      _id: req.params.fileId
    })
    .then(function(file) {
      var ret = file.toObject();
      ret.urls = fileHelper.fileToUrls(file);
      res.json(ret);
    }).catch(function(e) {
      res.status(400).send(JSON.stringify(e));
    });
});

// get File by Ids
router.get('/getByIds/:fileIds', function(req, res) {
  logger.info('Get File Details By Ids', req.params.fileIds);
  var fileIds = req.params.fileIds.split(',');
  db.File
    .find({
      _id: { $in: fileIds }
    })
    .then(function(files) {
      var ret = [];
      for (var k in files) {
        var file = files[k].toObject();
        file.urls = fileHelper.fileToUrls(files[k]);
        ret.push(file);
      }
      res.json({files: ret});
    }).catch(function(e) {
      res.status(400).send(JSON.stringify(e));
    });
});


// get album details
router.get('/getAlbum/:albumId', function(req, res) {
  logger.info('Get Album Details', req.params.albumId);
  db.Album
    .findOne({
      _id: req.params.albumId
    })
    .then(function(album) {
      var ret = album.toObject();
      db.File
        .find({
          albumId: req.params.albumId
        })
        .then(function(files) {
          ret.files = [];
          var file = {};
          for (var k in files) {
            file = files[k].toObject();
            file.urls = fileHelper.fileToUrls(files[k]);
            ret.files.push(file);
          }
          res.json(ret);
        }).catch(function(e) {
          res.status(400).send(JSON.stringify(e));
        });
    }).catch(function(e) {
      res.status(400).send(JSON.stringify(e));
    });
});

module.exports = router;
