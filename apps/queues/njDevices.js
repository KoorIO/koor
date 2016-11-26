'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'njDevices';

consumer.task = function(job, done){
    var data = job.data;
    var type = 'devices';

    services.Device.getDeviceById({
        deviceId: data.device._id,
        accessToken: data.accessToken
    }).then(function(body) {
		var session = driver.session();
        if (!body._id) {
			session
            .run('MATCH (u:Devices {deviceId: {deviceId}}) DELETE u', { deviceId: body._id })
			.subscribe({
				onCompleted: function() {
                    logger.debug('Delete Recommendation Device', data.deviceId);
					session.close();
				},
				onError: function(error) {
					logger.error(error);
				}
			});
        } else {
			session
            .run('MERGE (u:Devices {deviceId: {deviceId}})', { deviceId: body._id })
			.subscribe({
				onCompleted: function() {
                    logger.debug('Create Recommendation Device', data.deviceId);
					session.close();
				},
				onError: function(error) {
					logger.error(error);
				}
			});
        }
    }).catch(function(e) {
        logger.error(e)
    });
    done();
};

module.exports = consumer;
