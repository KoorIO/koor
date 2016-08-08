'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// create a new api
router.post('/create', function(req, res){
    var api = new db.Api(req.body);
    logger.debug('Create a New Api', req.body);
    api.save(function(error, new_api){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        // remove security attributes
        new_api = api.toObject();
        res.send(JSON.stringify(new_api));
    });
});

// get a api by id
router.get('/get/:id', function(req, res){
    logger.debug('Get Api By Id', req.params.id);
    db.Api.findOne({
        _id: req.params.id
    }).then(function(api){
        api = api.toObject();
        res.send(JSON.stringify(api));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a api by id
router.get('/delete/:id', function(req, res){
    logger.debug('Delete Api By Id', req.params.id);
    db.Api.remove({
        _id: req.params.id
    }).then(function(err){
        if (err) {
            throw true;
        } else {
            res.json({});
        }
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a api by id
router.get('/update/:id', function(req, res){
    logger.debug('Update Api By Id', req.params.id);
    var api = new db.Api(req.body);
    db.Api.findOneAndUpdate({
        _id: req.params.id
    }, api).then(function(err){
        if (err) {
            throw true;
        } else {
            res.json({});
        }
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of apis
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Api.count({}, function(err, c) {
        db.Api
        .find()
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(apis) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: apis
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
