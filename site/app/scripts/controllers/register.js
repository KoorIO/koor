'use strict';

angular.module('siteSeedApp')

.controller('RegisterCtrl', function(Users, $state) {
    var vs = this;
    vs.register = function login(){
        var userData = {
            username: vs.username,
            email: vs.email,
            password: vs.password,
            firstname: vs.firstname,
            lastname: vs.lastname
        };
        Users.register(userData).then(function(){
            vs.error = null;
            $state.go('thankyou');
        }).catch(function(){
            vs.error = 'Register Denied, Your username or Email is exists!';
        });
    };
})
.controller('ForgotPasswordCtrl', function(Users, $state) {
    var fp = this;
    fp.forgotpassword = function login(){
        var data = {
            email: fp.email
        };
        Users.forgotpassword(data).then(function(){
            fp.error = null;
            $state.go('postforgotpassword');
        }).catch(function(){
            fp.error = 'Your Email is not exists!';
        });
    };
})
.controller('ResetPasswordCtrl', function(Users, $state, $stateParams) {
    var fp = this;
    fp.resetpassword = function login(){
        var data = {
            password: fp.password,
            token: $stateParams.token
        };
        Users.resetpassword(data).then(function(){
            fp.error = null;
            $state.go('postresetpassword');
        }).catch(function(){
            fp.error = 'Your Token is incorrect!';
        });
    };
})
.controller('ActivateCtrl', function(Users, $stateParams, $state, $timeout, $scope) {
    $scope.error = false;
    Users.activate({'token': $stateParams.token}).then(function(){
        $timeout(function() {
            $state.go('login');
        }, 5000);
    }).catch(function(){
        $scope.error = 'Access Token Expired!';
    }); 
});
