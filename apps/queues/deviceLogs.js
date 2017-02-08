'use strict';
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var cache = require('../helpers/cache');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'deviceLogs';

consumer.task = function(job, done) {
  var data = job.data;
  var deviceLog = new db.DeviceLog({
    type: data.type,
    data: data.data,
    deviceId: data.deviceId
  });

  logger.debug('New Device Logs', data.deviceId);

  deviceLog.save(function(error) {
    if (error) {
      logger.debug('Failed - Save Device Log', data.deviceId);
    } else {
      cache.publish('device_logs', JSON.stringify(deviceLog));
      logger.debug('Saved Device Log', deviceLog._id);
    }
  });
  done();
};

module.exports = consumer;
