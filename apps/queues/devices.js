'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models/mongodb');
var services = require('../services');
consumer.name = os.hostname() + 'devices';

consumer.task = function(job, done) {
  var data = job.data;
  logger.debug('Device Worker', data.device._id);
  var q = require('../queues');
  if (data.type === 'CREATE_DEVICE' || data.type === 'DELETE_DEVICE') {
    q.create(os.hostname() + 'njDevices', data).priority('high').save();
    services.User.getUserById(data).then(function(user) {
      var feed = {
        type: data.type,
        userId: data.userId,
        objectType: 'DEVICE',
        objectId: data.device._id,
        data: {
          user: user,
          object: data.device
        }
      };
      q.create('feeds', feed).priority('low').save();
    }).catch(function(e) {
      logger.debug('Failed - get user details', e);
    });
  }
  q.create(os.hostname() + 'esDevices', data).priority('high').save();
  if (data.type === 'CREATE_DEVICE') {
    db.Api.create({
      userId: data.userId,
      name: 'Device ' + data.device.name,
      path: 'devices/' + data.device._id,
      method: 'POST',
      tags: ['Devices'],
      description: 'Send messages to device ' + data.device._id,
      projectId: data.device.projectId,
      request: [ 'message' ],
      response: {
        status: '200',
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'UTF-8'
        },
        body: { message: 'OK' }
      }
    }).then(function(api) {
      logger.debug('Create API successfully', api._id);
    }).catch(function(e) {
      logger.debug('Failed - create API', e);
    });
  }
  done();
};

module.exports = consumer;
