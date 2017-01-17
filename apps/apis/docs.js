'use strict';
var express = require('express'),
    db = require('../models/mongodb'),
    logger = require('../helpers/logger'),
    router = express.Router();

// run a new api
router.all('/:projectUrl', function(req, res) {
    logger.debug('Get Api Docs %s', req.params.projectUrl);
    db.Project.findOne({
        domain: req.params.projectUrl
    }, function(error, p) {
        if (error || !p) {
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
                        swagger['info']['version'] = '1.0';
                        var paths = {};
                        for (var k in apis) {
                            var a = apis[k];
                            var path = '/' + a.path;
                            paths[path] = {};
                            paths[path][a.method.toLowerCase()] = {};
                            paths[path][a.method.toLowerCase()]['description'] = a.description;
                            paths[path][a.method.toLowerCase()]['summary'] = a.name;
                            paths[path][a.method.toLowerCase()]['tags'] = a.tags;
                            paths[path][a.method.toLowerCase()]['parameters'] = [];
                            var pin = 'query';
                            for (var j in a.request) {
                                if (a.method.toLowerCase() !== 'get') {
                                    pin = 'formData';
                                } else {
                                    pin = 'query';
                                }
                                paths[path][a.method.toLowerCase()]['parameters'].push({
                                    'in': pin,
                                    name: a.request[j],
                                    required: false,
                                    type: 'string'
                                });
                            }
                            paths[path][a.method.toLowerCase()]['responses'] = {
                                '200': {
                                    'description': 'OK'
                                }
                            };
                        }
                        swagger['paths'] = paths;
                        return res.json(swagger);
                    }
                } catch (e) {
                    return res.status(406).json({});
                }
            });
        }
    });
});

module.exports = router;
