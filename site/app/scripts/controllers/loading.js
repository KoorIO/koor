'use strict';
angular.module('siteSeedApp')
.controller('LoadingCtrl', function($rootScope, $scope, $state) {
    if ('username' in $rootScope.userInfo) {
        $state.go('home');
    } else {
        $state.go('login');
    }
    $scope.forUnitTest = true;
});
