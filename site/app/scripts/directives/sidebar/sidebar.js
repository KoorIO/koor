'use strict';

angular.module('siteSeedApp')
.directive('sidebar',[function() {
    return {
        templateUrl:'views/sidebar/sidebar.html',
        restrict: 'E',
        scope: {
        },
        controller: function($scope, Users, $state, $timeout) {
            $scope.stateName = $state.current.name;
            $scope.changeRoute = function(stateName) {
                $scope.stateName = stateName;
            };
            Users.get().then(function(res) {
                $scope.user = res;
            });
        }
    }
}]);
