'use strict';
var winston = require('winston');
var config = require('config');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.get('logs.level'),
      handleExceptions: false,
      json: false,
      colorize: false,
      formatter: function(options) {
                // Return string will be passed to logger.
        return options.level.toUpperCase() +': '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : ' [in websocket:0]');
      }
    }),
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message) {
    logger.info(message);
  }
};
