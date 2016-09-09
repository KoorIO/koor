"use strict";
angular.module('siteSeedApp').factory('Socket', function($log) {
    return {
        connect: function(domain) {
            var socket = io.connect('http://' + domain);

            socket.on('connect', function(){
                $log.info(domain, 'connected');
                socket.emit('admins', 'hello');
            });
            return socket;
        }
    };
});
