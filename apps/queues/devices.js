'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var utils = require('../helpers/utils');
var db = require('../models/mongodb');
consumer.name = os.hostname() + 'devices';

consumer.task = function(job, done) {
    var data = job.data;
    logger.debug('Device Worker', data.device._id);
    var q = require('../queues');
    var feed = {
        type: data.type,
        userId: data.userId,
        objectType: 'DEVICE',
        objectId: data.device._id,
        data: {
            device: data.device 
        }
    };
    if (data.type === 'CREATE_DEVICE' || data.type === 'DELETE_DEVICE') {
        q.create(utils.getHostnameSocials() + 'feeds', feed).priority('low').save();
        q.create(os.hostname() + 'njDevices', data).priority('high').save();
    }
    q.create(os.hostname() + 'esDevices', data).priority('high').save();
    if (data.type === 'CREATE_DEVICE') {
        db.Api.create({
            name: data.device.name,
            path: 'devices/' + data.device._id,
            method: 'POST',
            tags: ['Devices'],
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'UTF-8'
            },
            description: 'Send messages to device ' + data.device._id,
            projectId: data.device.projectId,
            request: [ 'message' ],
            response: {
                status: 200,
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
