'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var db = require('../models/mongodb');
var utils = require('../helpers/utils');
var request = require('request');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var services = require('../services');
consumer.name = os.hostname() + 'esUsers';

consumer.task = function(job, done){
    var data = job.data;
    var type = 'users';

    logger.debug('Create Search User', data.userId);
    services.User.getUserById(data).then(function(body) {
        if (!body._id) {
            es.delete({
                index: config.get('es.index'),
                type: type,
                id: data.userId
            }, function (error, response) {
                logger.debug('Delete a User in Search', data.userId);
            });
        } else {
            delete body['_id'];
            es.index({
                index: config.get('es.index'),
                type: type,
                id: data.userId,
                body: body
            }, function (error, response) {
                if (error) {
                    logger.error('Failed - Save User Search', error);
                }
                logger.debug('Create/Update a User in Search', data.userId);
            });
        }
    }).catch(function(e) {
        logger.error(e);
    });
    done();
};

module.exports = consumer;
