'use strict';
angular.module('siteSeedApp').factory('Followers', function($resource, $q, APP_CONFIG) {
    return {
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.followers.create;
            var Followers = $resource(url);
            
            Followers.save(data, function(res) {
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
        delete: function(userId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.followers.delete;
            
            var Followers = $resource(url, {userId: userId});
            
            Followers.delete(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        list: function(page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.followers.list;
            var Followers = $resource(url, {limit: limit, page: page});
            
            Followers.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        listByUserId: function(userId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.followers.listByUserId;
            var Followers = $resource(url, {userId: userId, limit: limit, page: page});
            
            Followers.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        listFollowingByUserId: function(userId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.followers.listFollowingByUserId;
            var Followers = $resource(url, {userId: userId, limit: limit, page: page});
            
            Followers.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        listFollowing: function(page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.followers.listFollowing;
            var Followers = $resource(url, {limit: limit, page: page});
            
            Followers.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
