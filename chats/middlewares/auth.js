'use strict';
var _ = require('lodash');
var config = require('config');
var logger = require('../helpers/logger');
var cache = require('../helpers/cache');

module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (req.originalUrl.match(/^\/files\/(.*)\/(.*)\/(.*)\.(png|jpg|jpeg|gif)/gi)) {
        return next();
    }
    var t = req.get('Authorization');
    var unauthorization = config.get('unauthorization');
    if (_.indexOf(unauthorization, req.url) < 0) {
        if (t === undefined) {
            logger.debug('Access Denied', req.url);
            return res.status(401).send(JSON.stringify({}));
        }
        t = t.replace('Bearer ', '');
        cache.get(t, function(error, user) {
            if (!error && user) {
                req.user = JSON.parse(user);
                req.body.userId = req.user._id;
                req.body.accessToken = t;
                logger.debug('Nice authorization %s !!!', JSON.parse(user)._id);
                return next();
            } else {
                logger.debug('Access Denied %s !!!', t);
                return res.status(401).send(JSON.stringify({}));
            }
        });
    } else {
        return next();
    }
};

