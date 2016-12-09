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
        }
    };
});
