'use strict';

module.exports = function(req, res, next) {
    req.body.userId = '57a85bec81a3c41464322cf5';
    return next();
};
