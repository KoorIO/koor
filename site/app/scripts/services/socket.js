"use strict";
angular.module('siteSeedApp').factory('Socket', function($log, APP_CONFIG) {
    return {
        connect: function(domain) {
            var socket = io.connect(APP_CONFIG.protocols.http + domain);

            socket.on('connect', function(){
                $log.info(domain, 'connected');
                socket.emit('admins', 'hello');
            });
            return socket;
        },
        connectDevices: function(deviceId, domain) {
            var socket = io.connect(APP_CONFIG.protocols.http + domain);

            socket.on('connect', function(){
                $log.info('devices', deviceId, domain, 'connected');
                socket.emit('devices', {
                    deviceId: deviceId
                });
            });
            return socket;
        }
    };
});
