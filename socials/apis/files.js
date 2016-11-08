'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    fileHelper = require('../helpers/file'),
    os = require('os'),
    router = express.Router();

// get file details
router.get('/get/:fileId', function(req, res){
    logger.info('Get File Details', req.params.fileId);
    db.File
    .findOne({
        _id: req.params.fileId
    })
    .then(function(file) {
        if (err) {
            throw true;
        }
        file.urls = fileHelper.fileToUrls(file);
        res.json(file);
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// get album details
router.get('/getAlbum/:albumId', function(req, res){
    logger.info('Get Album Details', req.params.albumId);
    db.Album
    .findOne({
        _id: req.params.albumId
    })
    .then(function(album) {
        db.File
        .find({
            albumId: req.params.albumId
        })
        .then(function(err, files) {
            if (err) {
                throw true;
            }
            for (var k in files) {
                files[k].urls = fileHelper.fileToUrls(files[k]);
            }
            album.files = files;
            res.json(album);
        });
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

module.exports = router;
