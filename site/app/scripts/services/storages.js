'use strict';
angular.module('siteSeedApp').factory('Storages', function($resource, $q, APP_CONFIG) {
    return {
        get: function(fieldId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.storages.get;
            var Storage = $resource(url, {fieldId: fieldId});
            
            Storage.query(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
