'use strict';
var config = require('config');

var logger = require('../helpers/logger.js');

var sub = require('redis').createClient({
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    prefix: config.get('redis.prefix'),
    'auth_pass': config.get('redis.password')
});


exports = module.exports = function(io){
    sub.subscribe('field_data');
    sub.subscribe('device_data');
    sub.subscribe('notifications');
    sub.on('message', function(channel, message) {
        var data = JSON.parse(message);
        var adminRoom = data.domain + '-admins';
        if (channel === 'field_data') {
            io.sockets.in(adminRoom).emit('field_data', data);
        }
        if (channel === 'device_data') {
            logger.debug('Device %s change Status %s', data.deviceId, data.status);
            io.sockets.in(adminRoom).emit('device_data', data);
        }
        if (channel === 'notifications') {
            logger.debug('Notification for user', data.userId);
            var userRoom = data.userId + '-users';
            io.sockets.in(userRoom).emit('notifications', data);
        }
    });

    io.on('connection', function (socket) {
        var host = socket.handshake.headers.host.toString();
        logger.debug('New Client %s connected - host %s', socket.id, host);
        socket.join(host);
        var adminRoom = host + '-admins';
        socket.on('admins', function () {
            logger.debug('New Client %s join Room %s', socket.id, adminRoom);
            socket.join(adminRoom);
        });
        socket.on('users', function (data) {
            var userRoom = data.userId + '-users';
            logger.debug('New Client %s join Room %s', socket.id, userRoom);
            socket.join(userRoom);
        });
        socket.on('test_message', function (message) {
            if ('socketId' in message) {
                socket.to('/#' + message.socketId).emit('test_message', message);
            } else {
                socket.broadcast.to(adminRoom).emit('test_message', message);
            }
        });
        socket.on('broadcast_message', function (message) {
            socket.broadcast.emit('broadcast_message', message);
        });

        var ids = [];
        for (var k in io.sockets.in(host).connected){
            if (k > 10) break;
            ids.push({
                id: io.sockets.in(host).connected[k].conn.id,
                remoteAddress: io.sockets.in(host).connected[k].conn.remoteAddress
            });
        }
        io.sockets.in(adminRoom).emit('clients', ids);

    });
};
