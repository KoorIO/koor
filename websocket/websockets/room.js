'use strict';
var config = require('config');
var path = require('path');
var fs = require('fs');

var request = require('../services/request.js');
var logger = require('../helpers/logger.js');
var room = 'polsat';

var redis = require('redis').createClient;
var sub = require('redis').createClient({
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    prefix: config.get('redis.prefix'),
    auth_pass: config.get('redis.password')
});


function doProcess(obj, io){
    logger.debug('Do something here and send to client');
};

exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
        socket.on('disconnect', function(socket){
            logger.info('Disconnected', socket);
        });

    });
};
