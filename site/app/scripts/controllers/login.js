'use strict';

// LoginCtrl
angular.module('siteSeedApp')
.controller('LoginCtrl', function(Users, $rootScope, $cookies, $state) {
    var vm = this;
    // logout before login
    $rootScope.userInfo = {};
    $cookies.remove('userInfo');
    vm.login = function login(){
        Users.login(vm.username, vm.password).then(function(data){
            $rootScope.userInfo = data;
            $cookies.put('userInfo', JSON.stringify(data));
            vm.error = null;
            $state.go('home.dashboard');
        }).catch(function(){
            vm.error = 'Access Denied!';
        });
    };
});
