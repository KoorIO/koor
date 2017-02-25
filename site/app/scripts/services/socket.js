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
        connectProjects: function(domain, projectId) {
            var socket = io.connect(APP_CONFIG.protocols.http + domain);

            socket.on('connect', function(){
                socket.emit('projects', {
                  projectId: projectId
                });
            });
            return socket;
        },
        connectFields: function(domain, fieldId) {
            var socket = io.connect(APP_CONFIG.protocols.http + domain);

            socket.on('connect', function(){
                socket.emit('fields', {
                  projectId: fieldId
                });
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
