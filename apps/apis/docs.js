'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    logger = require('../helpers/logger'),
    os = require('os'),
    router = express.Router();

// run a new api
router.all('/:projectUrl', function(req, res){
    logger.debug('Get Api Docs %s', req.params.projectUrl);
    db.Project.findOne({
        domain: req.params.projectUrl
    }, function(error, p){
        if (error) {
            return res.status(406).json({});
        } else {
            db.Api.find({
                projectId: p._id
            }, function(error, apis) {
                try {
                    if (error) {
                        throw true;
                    } else {
                        var swagger = {};
                        swagger['basePath'] = '/';
                        swagger['swagger'] = '2.0';
                        swagger['definitions'] = {};
                        swagger['info'] = {};
                        swagger['info']['title'] = p.name;
                        var paths = {};
                        for (var k in apis){
                            var a = apis[k];
                            var path = '/' + a.path;
                            paths[path] = {};
                            paths[path][a.method.toLowerCase()] = {};
                            paths[path][a.method.toLowerCase()]['description'] = a.description;
                            paths[path][a.method.toLowerCase()]['summary'] = a.name;
                            paths[path][a.method.toLowerCase()]['tags'] = a.tags;
                            paths[path][a.method.toLowerCase()]['responses'] = a.response.body;
                        }
                        swagger['paths'] = paths;
                        return res.json(swagger);
                    }
                } catch(e) {
                    return res.status(406).json({});
                }
            });
        }
    });
});

module.exports = router;
