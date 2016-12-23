'use strict';
angular.module('siteSeedApp').factory('Posts', function($resource, $q, APP_CONFIG) {
    return {
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.posts.create;
            var Project = $resource(url);
            
            Project.save(data).$promise.then(function(res) {
                if (res.errorCode) {
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            }).catch(function(e) {
                deferred.reject(e);
            });
            return deferred.promise;
        }
    };
});
