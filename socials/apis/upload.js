'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    config = require('config'),
    os = require('os'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    config = require('config'),
    q = require('../queues'),
    sanitize = require("sanitize-filename"),
    busboy = require('connect-busboy');

router.use(busboy()); 

router.post('/images', function(req, res) {
    var album = new db.Album({
        name: req.body.name || 'Untitle',
        userId: req.body.userId
    });

    album.save(function(error) {
        if (error) {
            return res.status(406).json({error});
        }
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            var file = db.File({
                albumId: album._id,
                userId: req.body.userId,
                filePath: filePath
            });
            var filePath = path.join(__dirname, '/../uploads/', req.body.userId,
                                     album._id, file._id + '-' + sanitize(filename));
            fstream = fs.createWriteStream(filePath);
            logger.info('Store file ' + filePath);
            file.pipe(fstream);
            fstream.on('close', function () {

                q.create(os.hostname() + 'generateThumbnails', {
                    path: filePath
                }).priority('high').save();
                var extension = path.extname(filePath);
                var file = path.basename(filePath,extension);
                res.send(JSON.stringify({
                    'albumId': album._id,
                    'fileId': file._id
                }));
            });
        });
    });

});

module.exports = router;
