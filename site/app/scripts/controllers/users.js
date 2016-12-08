'use strict';
angular.module('siteSeedApp')
.controller('ListUserCtrl', function($scope, $stateParams, Users) {
    var page = $stateParams.page ? parseInt($stateParams.page) : 1,
        limit = $stateParams.limit ? parseInt($stateParams.limit) : 10;

    $scope.limit = limit;
    Users.list(page, limit).then(function(data){
        $scope.users = data.rows;
        $scope.count = data.count;
    });

    $scope.pageChanged = function() {
        Users.list($scope.current_page, limit).then(function(response){
            $scope.users = response.rows;
        });
    };

    $scope.forUnitTest = true;
})
.controller('HomeIndexCtrl', function($scope, Users, Feeds) {
    Users.get().then(function(res) {
        $scope.user = res;
    });
    Feeds.list().then(function(res) {
        $scope.feeds = res.rows;
        console.log($scope.feeds);
    });
})
.controller('UserDetailCtrl', function($scope, Users, $stateParams) {
    Users.getById($stateParams.userId).then(function(res) {
        $scope.user = res;
    });
})
.controller('UserProfileCtrl', function($scope, Users, $cookies, $log) {
    var userInfo = $cookies.get('userInfo') || '{}';

    Users.getById(JSON.parse(userInfo).userId).then(function(res) {
        $scope.user = res;
    });

    $scope.updateProfile = function(){
        var userData = {
            firstname: $scope.user.firstname,
            lastname: $scope.user.lastname,
            username: $scope.user.username
        };
        Users.update($scope.user._id, userData).then(function(){
            $log.info('Update successfully!');
        });
    };
});
