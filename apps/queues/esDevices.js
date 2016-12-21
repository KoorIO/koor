'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var services = require('../services');
consumer.name = os.hostname() + 'esDevices';

consumer.task = function(job, done){
    var data = job.data;
    var type = 'devices';

    logger.debug('Create Search Device', data.device._id);
    services.Device.getDeviceById({
        accessToken: data.accessToken,
        deviceId: data.device._id
    }).then(function(body) {
        if (!body._id) {
            es.delete({
                index: config.get('es.index'),
                type: type,
                id: data.device._id
            }, function (error) {
                logger.debug('Delete a Device in Search', data.device._id, error);
            });
        } else {
            delete body['_id'];
            es.index({
                index: config.get('es.index'),
                type: type,
                id: data.device._id,
                body: body
            }, function (error) {
                if (error) {
                    logger.error('Failed - Save Device Search', error);
                }
                logger.debug('Create/Update a Device in Search', data.device._id);
            });
        }
    }).catch(function(e) {
        logger.error('Failed - get data', e);
    });
    done();
};

module.exports = consumer;
