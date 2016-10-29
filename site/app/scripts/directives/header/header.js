'use strict';

angular.module('siteSeedApp')
.directive('header', function(){
    return {
        templateUrl:'views/header/header.html',
        restrict: 'E',
        scope: {},
        controller:function($scope, Notifications){
            Notifications.list(1, 10).then(function(res) {
                $scope.notifications = res.rows;
            });
        }
    }
});
