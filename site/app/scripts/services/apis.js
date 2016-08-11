'use strict';
angular.module('siteSeedApp').factory('Apis', function($resource, $q, APP_CONFIG) {
    return {
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apis.create;
            var Api = $resource(url);
            
            Api.save(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        list: function(projectId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apis.list;
            var Apis = $resource(url, {projectId: projectId, limit: limit, page: page});
            
            Apis.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        get: function(apiId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apis.get;
            var Apis = $resource(url, {apiId: apiId});
            
            Apis.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        remove: function(apiId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apis.delete;
            var Apis = $resource(url, {apiId: apiId});
            
            Apis.delete(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        update: function(apiId, data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.apis.delete;
            var Apis = $resource(url, {apiId: apiId});
            
            Apis.save(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
