'use strict';

angular.module('siteSeedApp')
.directive('header', function(){
    return {
        templateUrl:'views/header/header.html',
        restrict: 'E',
        scope: {},
        controller:function($scope, Notifications, Socket, APP_CONFIG, $cookies){
            $scope.badge = 0;
            Notifications.list(1, 10).then(function(res) {
                $scope.notifications = res.rows;
            });
            var socket = Socket.connect(APP_CONFIG.websocket);
            var userInfo = JSON.parse($cookies.get('userInfo') || '{}');
            socket.emit('users', {
                userId: userInfo._id
            });
            $scope.$on("$destroy", function() {
                socket.disconnect();
            });
            socket.on('notifications', function(data) {
                $scope.badge += 1;
                $scope.notifications.append(data)
                $scope.$apply();
            });

            $scope.updateNotifications = function() {
                $scope.badge = 0;
            };
        }
    }
});
