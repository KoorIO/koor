'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    slug = require('slug'),
    router = express.Router();

// create a new field
router.post('/create', function(req, res){
    var field = new db.Field({
        name: req.body.name,
        code: slug(req.body.name, {lower: true, replacement: '_'}),
        description: req.body.description,
        projectId: req.body.projectId
    });
    logger.debug('Create a New Field', req.body);
    field.save(function(error, new_field){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        // remove security attributes
        new_field = field.toObject();
        res.send(JSON.stringify(new_field));
    });
});

// get a field by id
router.get('/get/:id', function(req, res){
    logger.debug('Get Field By Id', req.params.id);
    db.Field.findOne({
        _id: req.params.id
    }).then(function(field){
        field = field.toObject();
        res.send(JSON.stringify(field));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a field by id
router.delete('/delete/:id', function(req, res){
    logger.debug('Delete Field By Id', req.params.id);
    db.Field.remove({
        _id: req.params.id
    }).then(function(){
        res.json({});
    });
});

// update a field by id
router.put('/update/:id', function(req, res){
    logger.debug('Update Field By Id', req.params.id);
    db.Field.findOne({
        _id: req.params.id
    }).then(function(field) {
        field.name = req.body.name;
        field.code = slug(req.body.name, {lower: true, replacement: '_'});
        field.description = req.body.description;
        field.save().then(function(error){
            res.json(field);
        });
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of fields
router.get('/list/:projectId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Field.count({ projectId: req.params.projectId }, function(err, c) {
        db.Field
        .find({
            projectId: req.params.projectId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(fields) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: fields
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
