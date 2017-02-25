'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models/mongodb');
consumer.name = os.hostname() + 'fields';

consumer.task = function(job, done) {
  var data = job.data;
  logger.debug('Field Worker', data.field._id);
  if (data.type === 'CREATE_FIELD') {
    db.Api.create({
      userId: data.userId,
      name: 'Field ' + data.field.name,
      path: 'fields/' + data.field._id,
      method: 'POST',
      tags: ['Fields'],
      description: 'Store data ' + data.field._id,
      projectId: data.field.projectId,
      request: [ data.field.code ],
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
