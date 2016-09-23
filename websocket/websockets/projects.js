'use strict';
var config = require('config');

var logger = require('../helpers/logger.js');

exports = module.exports = function(io){
    io.on('connection', function (socket) {
        var host = socket.handshake.headers.host.toString();
        logger.debug('New Client %s connected - host %s', socket.id, host);
        socket.join(host);
        var adminRoom = host + '-admins';
        socket.on('admins', function (message) {
            logger.debug('New Client %s join Room %s', socket.id, adminRoom);
            socket.join(adminRoom);
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
