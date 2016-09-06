'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    cache = require('../helpers/cache'),
    logger = require('../helpers/logger'),
    os = require('os'),
    config = require('config'),
    router = express.Router();

// create a new project
router.post('/create', function(req, res){
    var project = new db.Project(req.body);
    logger.debug('Create a New Project', project.name);
    project.save(function(error, new_project){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        new_project.domain = new_project._id + '.' + config.get('server.domain');
        new_project.save();
        // remove security attributes
        new_project = project.toObject();
        // send message create a domain to queue
        q.create(os.hostname() + 'create_domain', {
            projectId: new_project._id
        }).priority('high').save();

        // start websocket
        cache.publish('start_project', new_project.domain);

        res.send(JSON.stringify(new_project));
    });
});

// start websocket
router.post('/start/:id', function(req, res){
    logger.debug('Start Websocket Project By Id', req.params.id);
    db.Project.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(project){
        project = project.toObject();
        // start websocket
        cache.publish('start_project', project.domain);
        res.send(JSON.stringify(project));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });

});

// get a project by id
router.get('/get/:id', function(req, res){
    logger.debug('Get Project By Id', req.params.id);
    db.Project.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(project){
        project = project.toObject();
        res.send(JSON.stringify(project));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a project by id
router.delete('/delete/:id', function(req, res){
    logger.debug('Delete Project By Id', req.params.id);
    db.Project.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(){
        // stop websocket
        var domain = req.params.id + '.' + config.get('server.domain');
        cache.publish('start_project', domain);
        res.json({});
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// update a project by id
router.put('/update/:id', function(req, res){
    logger.debug('Update Project By Id', req.params.id);
    db.Project.findOne({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(project) {
        project.domain = req.body.domain;
        project.save(function() {
            res.json({});
        })
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of projects
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Project.count({}, function(err, c) {
        db.Project
        .find({
            userId: req.body.userId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(projects) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: projects
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
