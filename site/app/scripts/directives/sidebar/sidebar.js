'use strict';

angular.module('siteSeedApp')
.directive('sidebar',[function() {
    return {
        templateUrl:'views/sidebar/sidebar.html',
        restrict: 'E',
        scope: {
        },
        controller: function($scope, Users) {
            Users.get().then(function(res) {
                $scope.user = res;
            });
        }
    }
}]);
