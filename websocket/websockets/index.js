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
    sub.subscribe('device_logs');
    sub.subscribe('notifications');
    sub.on('message', function(channel, message) {
        var data = JSON.parse(message);
        if (channel === 'field_data') {
            var fieldRoom = data._id + '-fields';
            io.sockets.in(fieldRoom).emit('field_data', data);
        }
        if (channel === 'device_data') {
            logger.debug('Device %s change Status %s', data.deviceId, data.status);
            var deviceRoom = 'devices_' + data.deviceId;
            io.sockets.in(deviceRoom).emit('device_data', data);
        }
        if (channel === 'device_logs') {
            logger.debug('Device %s logs %s', data.deviceId);
            var deviceRoom = 'devices_' + data.deviceId;
            io.sockets.in(deviceRoom).emit('device_logs', data);
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
        var projectRoom = 'projects';
        socket.on('projects', function (data) {
            projectRoom = data.projectId + '-projects';
            logger.debug('New Client %s join Room %s', socket.id, projectRoom);
            socket.join(projectRoom);
            var ids = [];
            for (var k in io.sockets.in(projectRoom).connected){
                if (k > 10) break;
                ids.push({
                    id: io.sockets.in(projectRoom).connected[k].conn.id,
                    remoteAddress: io.sockets.in(projectRoom).connected[k].conn.remoteAddress
                });
            }
            io.sockets.in(projectRoom).emit('clients', ids);

        });
        socket.on('users', function (data) {
            var userRoom = data.userId + '-users';
            logger.debug('New Client %s join Room %s', socket.id, userRoom);
            socket.join(userRoom);
        });
        socket.on('fields', function (data) {
            var fieldRoom = data.fieldId + '-fields';
            logger.debug('New Client %s join Room %s', socket.id, fieldRoom);
            socket.join(fieldRoom);
        });
        socket.on('devices', function (data) {
            var deviceRoom = 'devices_' + data.deviceId;
            logger.debug('New Client %s join Room %s', socket.id, deviceRoom);
            socket.join(deviceRoom);
        });
        socket.on('test_message', function (message) {
            if ('socketId' in message) {
                socket.to('/#' + message.socketId).emit('test_message', message);
            } else {
                socket.broadcast.to(projectRoom).emit('test_message', message);
            }
        });
        socket.on('broadcast_message', function (message) {
            socket.broadcast.to(projectRoom).emit('broadcast_message', message);
        });

    });
};
