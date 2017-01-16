'use strict';
angular.module('siteSeedApp').factory('Feeds', function($resource, $q, APP_CONFIG) {
    return {
        wall: function(userId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.feeds.wall;
            var Feeds = $resource(url, {userId: userId});
            
            Feeds.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        list: function(){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.feeds.list;
            var Feeds = $resource(url);
            
            Feeds.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
