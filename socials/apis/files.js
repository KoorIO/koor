'use strict';
var express = require('express'), 
    db = require('../models'),
    logger = require('../helpers/logger'),
    config = require('config'),
    os = require('os'),
    router = express.Router();
    fs = require('fs'),
    path = require('path'),
    config = require('config'),
    q = require('../queues'),
    busboy = require('connect-busboy');

router.use(busboy()); 

router.post('/upload', function(req, res) {
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
            var filePath = path.join(__dirname, '/../uploads/', filename);
            fstream = fs.createWriteStream(filePath);
            logger.info('Store file ' + filePath);
            file.pipe(fstream);
            fstream.on('close', function () {

                var file = db.File({
                    albumId: album._id,
                    userId: req.body.userId,
                    filePath: filePath
                });
                q.create('generateThumbnails', {
                    path: filePath
                }).priority('high').save();
                var extension = path.extname(filePath);
                var file = path.basename(filePath,extension);
                res.send(JSON.stringify({
                    'path': config.get('server.url') + '/upload/' + filename,
                    'thumbnails': {
                        s100: config.get('server.url') + '/upload/' + file + '-thumbnail-100x100' + extension,
                        s200: config.get('server.url') + '/upload/' + file + '-thumbnail-200x200' + extension,
                        s300: config.get('server.url') + '/upload/' + file + '-thumbnail-300x300' + extension,
                        s400: config.get('server.url') + '/upload/' + file + '-thumbnail-400x400' + extension,
                        s500: config.get('server.url') + '/upload/' + file + '-thumbnail-500x500' + extension,
                        s600: config.get('server.url') + '/upload/' + file + '-thumbnail-600x600' + extension
                    }
                }));
            });
        });
    });

});

// follow a user
router.post('/create', function(req, res){
    var follower = new db.Follower({
        followerId: req.body.followerId,
        userId: req.body.userId
    });
    logger.debug('User %s follows %s', req.body.userId, req.body.followerId);
    follower.save(function(error){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        q.create(os.hostname() + 'notifications', {
            type: 'FOLLOW_USER',
            userId: follower.userId,
            data: follower
        }).priority('high').save();
        res.json(follower);
    });
});

// get list of followers
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Follower List', limit, skip);
    db.Follower.count({
        userId: req.body.userId
    }, function(err, c) {
        db.Follower
        .find({
            userId: req.body.userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(followers) {
            if (err) {
                throw {};
            }
            var ret = {
                count: c,
                rows: followers
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

// get list of following
router.get('/following/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Following List', limit, skip);
    db.Follower.count({
        followerId: req.body.userId
    }, function(err, c) {
        db.Follower
        .find({
            followerId: req.body.userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(followers) {
            if (err) {
                throw {};
            }
            var ret = {
                count: c,
                rows: followers
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
