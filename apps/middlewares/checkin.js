'use strict';
var _ = require('lodash');
var config = require('config');
var logger = require('../helpers/logger');
var db = require('../models/mongodb');

module.exports = function(req, res, next) {
    if (!req.originalUrl.match(/^\/get\/(.*)/g)) {
        return next();
    }
    var t = req.get('Authorization');
    if (t === undefined) {
        logger.debug('Access Denied', req.url);
        return res.status(401).send(JSON.stringify({}));
    } else {
        t = t.replace('Bearer ', '');
        db.Project.findOne({
            secretKey: t
        }).then(function(project) {
            if (!project) {
                throw true;
            }
            logger.info('Nice project secret key %s !!!', t);
            return next();
        }).catch(function(e) {
            return res.status(400).send(JSON.stringify(e));
        });
    }
};

