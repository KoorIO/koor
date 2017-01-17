'use strict';

angular.module('siteSeedApp')
.directive('sidebarUser',[function() {
    return {
        templateUrl:'views/sidebar/sidebar-user.html',
        restrict: 'E',
        scope: {
        },
        controller: function($scope, Users, Followers, $stateParams, $rootScope) {
            $scope.userInfo = $rootScope.userInfo;
            Users.getById($stateParams.userId).then(function(res) {
                $scope.user = res;
                $scope.follow = function() {
                    Followers.create({followingId: $scope.user._id}).then(function() {
                        $scope.user.isFollowed = true;
                    });
                };
                $scope.unfollow = function() {
                    Followers.delete($scope.user._id).then(function() {
                        $scope.user.isFollowed = false;
                    });
                };
            });
        }
    }
}]);
