'use strict';
angular.module('siteSeedApp').factory('Github', function($resource, $q, APP_CONFIG) {
    return {
        getAccessToken: function(code){
            var data = {
                code: code,
                client_id: APP_CONFIG.github.clientId,
                redirect_url: APP_CONFIG.github.redirectUrl
            };
            var deferred = $q.defer();
            var url = APP_CONFIG.services.users.github;
            var Github = $resource(url);
            
            Github.save(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
