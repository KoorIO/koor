'use strict';
angular.module('siteSeedApp').factory('Notifications', function($resource, $q, APP_CONFIG) {
    return {
        list: function(page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.notifications.list;
            var Notification = $resource(url, {page: page, limit: limit});
            
            Notification.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
