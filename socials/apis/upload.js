'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    fileHelper = require('../helpers/file'),
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
        var files = [];
        var albumId = album._id;
        req.busboy.on('field', function (fieldname, value) {
            console.log('---->', fieldname, value);
        });
        req.busboy.on('file', function (fieldname, img, filename) {
            var file = db.File({
                albumId: albumId,
                userId: req.body.userId,
                fileName: ''
            });
            file.save(function(error) {
                if (error) {
                    return res.status(406).json({error});
                }
                var dirPath = path.join(__dirname, '/../uploads/', req.body.userId,
                                         String(album._id));
                if (!fs.existsSync(dirPath)) {
                    var shell = require('shelljs');
                    shell.mkdir('-p', dirPath);
                }
                var fileName = file._id + '-' + sanitize(filename);
                var filePath = path.join(dirPath, fileName);
                fstream = fs.createWriteStream(filePath);
                logger.info('Store file ' + filePath);
                img.pipe(fstream);
                file.fileName = fileName;
                files.push({
                    fileId: file._id,
                    urls: fileHelper.fileToUrls(file)
                });
                file.save(function(error) {
                    if (error) {
                        return res.status(406).json({error});
                    }
                    fstream.on('close', function () {
                        q.create(os.hostname() + 'generateThumbnails', {
                            path: filePath
                        }).priority('high').save();
                    });
                });
            });

        });
        req.busboy.on('finish', function() {
            res.send(JSON.stringify({
                albumId: albumId,
                files: files
            }));
        });
    });

});

module.exports = router;
