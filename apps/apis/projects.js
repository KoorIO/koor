'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    q = require('../queues'),
    cache = require('../helpers/cache'),
    logger = require('../helpers/logger'),
    utils = require('../helpers/utils'),
    services = require('../services'),
    os = require('os'),
    config = require('config'),
    router = express.Router();

// create a new project
router.post('/create', function(req, res){
    logger.debug('Create a New Project', req.body.name);
    db.Project.count({
        userId: req.body.userId
    }).then(function(c) {
        if (parseInt(c) < parseInt(req.user.projectLimit)) {
            db.Project.generateSecretKey().then(function(key) {
                var project = new db.Project({
                    name: req.body.name,
                    description: req.body.description,
                    fileId: req.body.fileId,
                    albumId: req.body.albumId,
                    userId: req.body.userId,
                    secretKey: key
                });
                project.save(function(error){
                    if (error) {
                        logger.debug('Failed - Save Project', error);
                        return res.status(406).send(JSON.stringify({error}));
                    }
                    project.domain = project._id + '.' + config.get('server.domain');
                    project.save(function(error) {
                        q.create(os.hostname() + 'projects', {
                            projectId: project._id,
                            userId: project.userId,
                            accessToken: req.body.accessToken,
                            type: 'CREATE_PROJECT',
                            data: {
                                _id: project._id,
                                name: project.name,
                                domain: project.domain,
                                userId: project.userId
                            }
                        }).priority('high').save();
                        res.send(JSON.stringify(project));
                    });
                });
            });
        } else {
            logger.debug('Failed - Over Project Limit %s >= %s', c, req.user.projectLimit);
            res.status(406).json({message: 'Project Limit'});
        }
    }).catch(function(e) {
        logger.debug('Failed - Count Project Number', e);
        res.status(406).json({message: 'Bad Request'});
    });
});

// get a project by id
router.get('/get/:id', function(req, res){
    logger.debug('Get Project By Id', req.params.id);
    db.Project.findOne({
        _id: req.params.id
    }).then(function(project) {
        project = project.toObject();
        if (String(req.body.userId) !== String(project.userId)) {
            delete project.secretKey;
        }
        if (project.fileId) {
            services.File.getFileById({
                fileId: project.fileId,
                accessToken: req.body.accessToken
            }).then(function(body) {
                project.file = body;
                res.json(project);
            });
        } else {
            res.json(project);
        }
    }).catch(function(e){
        console.log(e);
        res.status(500).send(JSON.stringify(e));
    });
});

// delete a project by id
router.delete('/delete/:id', function(req, res){
    logger.debug('Delete Project By Id', req.params.id);
    db.Project.findOneAndRemove({
        _id: req.params.id,
        userId: req.body.userId
    }).then(function(project){
        // send message create a domain to queue
        q.create(os.hostname() + 'delete_domain', {
            domain: project.domain,
            dnsId: project.dnsId
        }).priority('high').save();
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
        project.name = req.body.name;
        project.secretKey = req.body.secretKey;
        project.save(function() {
            res.json({});
        })
    }).catch(function(e){
        res.status(400).send(JSON.stringify(e));
    });
});

// generate secret key
router.get('/generate/secretKey', function(req, res){
    logger.debug('Generate Secret Key');
    db.Project.generateSecretKey().then(function(key) {
        res.json({'secret_key': key});
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of projects
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Project.count({
        userId: req.body.userId
    }, function(err, c) {
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
            var fileIds = [];
            var rows = [];
            for (var k in projects) {
                var project = projects[k].toObject();
                if (String(project.userId) !== String(req.body.userId)) {
                    delete project.secretKey;
                }
                rows.push(project);
                if (project.fileId) {
                    fileIds.push(project.fileId);
                }
                if (!projects[k].dnsStatus) {
                    // send message check dns status to queue
                    q.create(os.hostname() + 'dnsresolve', {
                        projectId: projects[k]._id,
                        domain: projects[k].domain
                    }).priority('high').save();
                }
            }
            var ret = {
                count: c,
                rows: rows
            };
            services.File.getFileByIds({
                fileIds: fileIds,
                accessToken: req.body.accessToken
            }).then(function(body) {
                body.files.forEach(function(item) {
                    for (var i in rows) {
                        if (item._id == rows[i].fileId) {
                            rows[i].file = item;
                        }
                    }

                });
                ret.rows = rows;
                res.json(ret);
            }).catch(function() {
                res.json(ret);
            });
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

module.exports = router;
