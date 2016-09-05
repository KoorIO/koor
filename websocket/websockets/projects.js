'use strict';
var config = require('config');

var logger = require('../helpers/logger.js');

var sub = require('redis').createClient({
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    prefix: config.get('redis.prefix'),
    auth_pass: config.get('redis.password')
});


exports = module.exports = function(io){
    sub.subscribe('start_project');
    sub.subscribe('stop_project');

    sub.on('message', function(channel, message) {
        logger.debug('New message %s from channel %s', message, channel);
        if (channel === 'start_project') {
            var nsp = io.of('/' + message);
            nsp.on('connection', function (socket) {
                logger.debug('New Client %s connected - namespace %s', socket, message);
                socket.on('disconnect', function(socket){
                    logger.info('Disconnected', socket);
                });
            });
        }

        if (channel === 'stop_project') {
            delete io.nsps['/' + message];
        }

    });
};
