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

    sub.on('message', function(channel, namespace) {
        logger.debug('New message %s from channel %s', namespace, channel);
        if (channel === 'start_project') {
            if (namespace in io.nsps) {
                return;
            }
            var nsp = io.of('/' + namespace);
            var adminRoom = namespace + '-admins';
            nsp.on('connection', function (socket) {
                logger.debug('New Client %s connected - namespace %s', socket.id, namespace);
                var ids = [];
                for (var k in nsp.connected){
                    if (k > 10) break;
                    ids.push({
                        id: nsp.connected[k].conn.id,
                        remoteAddress: nsp.connected[k].conn.remoteAddress
                    });
                }
                socket.on('admins', function (message) {
                    socket.join(adminRoom);
                });
                socket.on('test_message', function (message) {
                    if ('socketId' in message) {
                        socket.to('/' + namespace + '#' + message.socketId).emit('test_message', message);
                    } else {
                        socket.broadcast.to(adminRoom).emit('test_message', message);
                    }
                });
                socket.on('broadcast_message', function (message) {
                    socket.broadcast.emit('broadcast_message', message);
                });
                nsp.emit('clients', ids); 
            });
        }

        if (channel === 'stop_project') {
            delete io.nsps['/' + message];
        }

    });
};
