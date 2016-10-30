'use strict';

angular.module('siteSeedApp')
.directive('header', function(){
    return {
        templateUrl:'views/header/header.html',
        restrict: 'E',
        scope: {},
        controller:function($scope, Notifications, Socket, APP_CONFIG){
            Notifications.list(1, 10).then(function(res) {
                $scope.notifications = res.rows;
            });
            var socket = Socket.connect(APP_CONFIG.websocket);
            $scope.$on("$destroy", function() {
                socket.disconnect();
            });
            socket.on('device_data', function(data) {
                if (data.deviceId === deviceId) {
                    $scope.device.status = data.status;
                    $scope.$apply();
                }
            });
        }
    }
});
