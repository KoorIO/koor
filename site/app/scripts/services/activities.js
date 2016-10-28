'use strict';
angular.module('siteSeedApp').factory('Activities', function($resource, $q, APP_CONFIG) {
    return {
        list: function(projectId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.activities.list;
            var Activity = $resource(url, {projectId: projectId, page: page, limit: limit});
            
            Activity.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
