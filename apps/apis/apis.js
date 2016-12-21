'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    router = express.Router();

// create a new api
router.post('/create', function(req, res){
    var api = new db.Api(req.body);
    logger.debug('Create a New Api', req.body);
    api.save(function(error){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        // remove security attributes
        var newApi = api.toObject();
        res.send(JSON.stringify(newApi));
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
router.delete('/delete/:id', function(req, res){
    logger.debug('Delete Api By Id', req.params.id);
    db.Api.remove({
        _id: req.params.id
    }).then(function(){
        res.json({});
    });
});

// update a api by id
router.put('/update/:id', function(req, res){
    logger.debug('Update Api By Id', req.params.id);
    db.Api.findOne({
        _id: req.params.id
    }).then(function(api){
        api.method = req.body.method;
        api.name = req.body.name;
        api.path = req.body.path;
        api.description = req.body.description;
        api.tags = req.body.tags;
        api.request = req.body.request;
        api.response = req.body.response;
        api.save(function(){
            res.json({});
        });
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of apis
router.get('/list/:projectId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Api.count({ projectId: req.params.projectId }, function(err, c) {
        db.Api
        .find({
            projectId: req.params.projectId
        })
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
