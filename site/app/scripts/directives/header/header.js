'use strict';

angular.module('siteSeedApp')
.directive('header', function(){
    return {
        templateUrl:'views/header/header.html',
        restrict: 'E',
        scope: {},
        controller:function($scope, Users, Notifications, Socket, APP_CONFIG, $cookies){
            $scope.badge = 0;
            Notifications.list(1, 10).then(function(res) {
                $scope.notifications = res.rows;
            });
            var socket = Socket.connect(APP_CONFIG.websocket);
            socket.on('connect', function() {
                var userInfo = JSON.parse($cookies.get('userInfo') || '{}');
                socket.emit('users', {
                    userId: userInfo.userId
                });
            });
            $scope.$on("$destroy", function() {
                socket.disconnect();
            });
            socket.on('notifications', function(data) {
                $scope.badge += 1;
                $scope.notifications.push(data)
                $scope.$apply();
            });

            $scope.updateNotifications = function() {
                $scope.badge = 0;
                Notifications.list(1, 10).then(function(res) {
                    $scope.notifications = res.rows;
                });
            };
            $scope.search = function(s) {
                return Users.search(s).then(function(res) {
                    console.log(res.hits);
                    return res.hits;
                });
            };
        }
    }
});
