'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    slug = require('slug'),
    router = express.Router();

// create a new field
router.post('/create', function(req, res) {
    logger.debug('Create a New Field', req.body.name);
    db.Field.count({ projectId: req.body.projectId }, function(err, c) {
        if (err || ((req.user.plan == 'free' || !req.user.plan) && (c > 10))) {
            logger.debug('Failed - Field Limit', req.body.name);
            return res.status(400).json({});
        }
        var field = new db.Field({
            name: req.body.name,
            code: slug(req.body.name, {lower: true, replacement: '_'}),
            description: req.body.description,
            projectId: req.body.projectId
        });
        field.save(function(error, newField) {
            if (error) {
                return res.status(406).send(JSON.stringify({error}));
            }
            // remove security attributes
            newField = field.toObject();
            res.send(JSON.stringify(newField));
        });
    });
});

// get a field by id
router.get('/get/:id', function(req, res) {
    logger.debug('Get Field By Id', req.params.id);
    db.Field.findOne({
        _id: req.params.id
    }).then(function(field) {
        field = field.toObject();
        res.send(JSON.stringify(field));
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a field by id
router.delete('/delete/:id', function(req, res, next) {
    logger.debug('Delete Field By Id', req.params.id);
    db.Field.remove({
        _id: req.params.id
    }).then(function() {
        return res.json({});
    }).catch(function(e) {
        logger.debug('Failed - remove field', e);
        return next(e);
    });
});

// update a field by id
router.put('/update/:id', function(req, res) {
    logger.debug('Update Field By Id', req.params.id);
    db.Field.findOne({
        _id: req.params.id
    }).then(function(field) {
        field.name = req.body.name;
        field.code = slug(req.body.name, {lower: true, replacement: '_'});
        field.description = req.body.description;
        field.save().then(function(error) {
            if (error) {
                res.status(500).send(JSON.stringify(error));
            }
            res.json(field);
        }).catch(function(e) {
            logger.debug('Failed - save field', e);
        });
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of fields
router.get('/list/:projectId/:page/:limit', function(req, res) {
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
