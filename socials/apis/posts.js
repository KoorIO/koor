'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    q = require('../queues'),
    os = require('os'),
    services = require('../services'),
    logger = require('../helpers/logger'),
    router = express.Router();

// get post
router.get('/get/:id', function(req, res, next) {
    logger.info('Get Post Details', req.params.postId);
    db.Post
    .findOne({
        _id: req.params.id
    })
    .then(function(post) {
        post = post.toObject();
        if (post.fileId) {
            services.File.getFileById({
                fileId: post.fileId,
                accessToken: req.body.accessToken
            }).then(function(body) {
                post.file = body;
                res.json(post);
            }).catch(function(e) {
                logger.debug('Failed - get file', e);
                return next(e);
            });
        } else {
            res.json(post);
        }
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// get list posts
router.get([
    '/list/:page/:limit',
    '/list/:userId/:page/:limit',
    '/list/:userId/:postType/:page/:limit'], function(req, res) {
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    var query = { userId: req.params.userId || req.body.userId };

    db.Post.count(query, function(err, c) {
        db.Post
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(posts) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: posts
            };
            res.json(ret);
        }).catch(function(e) {
            res.status(400).json(e);
        });
    });
});

// Create new post
router.post('/create', function(req, res) {
    logger.info('Create New Post', req.body.postType);
    var post = new db.Post({
        postType: req.body.postType,
        userId: req.body.userId,
        content: req.body.content,
        fileId: req.body.fileId,
        albumId: req.body.albumId
    });
    post.save(function(error) {
        if (error) {
            logger.debug('Failed - Save Post', error);
            return res.status(500).json(error);
        }
        q.create(os.hostname() + 'posts', {
            postId: post._id,
            userId: post.userId,
            accessToken: req.body.accessToken,
            type: 'CREATE_POST',
            data: post
        }).priority('high').save();
        return res.json(post);
    });
});

// Update post
router.put('/update/:id', function(req, res) {
    logger.debug('Update Post By Id', req.params.id);
    db.Post.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(post) {
        post.content = req.body.content;
        post.save(function() {
            res.json(post);
        });
    }).catch(function(e) {
        res.status(400).send(JSON.stringify(e));
    });
});

// delete a post by id
router.delete('/delete/:id', function(req, res) {
    logger.debug('Delete Post By Id', req.params.id);
    db.Post.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(post) {
        res.json(post);
    }).catch(function(e) {
        res.status(500).json(e);
    });
});

module.exports = router;
