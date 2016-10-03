'use strict';
angular.module('siteSeedApp').factory('Users', function($resource, $q, APP_CONFIG) {
    return {
        login: function(username, password){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.login;
            var data = {
                username: username,
                password: password
            };
            var Login = $resource(url);
            
            Login.save(data, function(res) {
                // login success
                if (res.errorCode) {
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            }, function(res) {
                // login fails
                deferred.reject(res);
            });
            return deferred.promise;
        },
        forgotpassword: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.forgotpassword;
            var Forgot = $resource(url);
            
            Forgot.save(data, function(res) {
                if (res.errorCode) {
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        resetpassword: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.resetpassword;
            var Reset = $resource(url);
            
            Reset.save(data, function(res) {
                if (res.erroCode) {
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        register: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.create;
            var Register = $resource(url);
            
            Register.save(data, function(res) {
                if (res.errorCode) {
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        activate: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.activate;
            var Activate = $resource(url);
            
            Activate.save(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        list: function(page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.list;
            var Users = $resource(url, {limit: limit, page: page});
            
            Users.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        get: function(userId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.get;
            var Users = $resource(url, {userId: userId});
            
            Users.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        update: function(userId, data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.update;
            console.log(url);
            var Users = $resource(url, {userId: userId}, {
                'update': { method: 'PUT' }
            });
            
            Users.update(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
