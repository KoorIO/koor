'use strict';
const logger = require('../helpers/logger');
const _ = require('lodash');

module.exports = function(err, req, res, next) {
  if (err) {
    err.status = err.status || 406;
    err.message = err.message ||  _.map(err, 'msg')[0] || 'Not Acceptable';
    logger.debug('Response Error Status', err.status, err.message);
    return res.status(err.status).json({
      status: err.status,
      message: err.message
    });
  }
  return next();
};
