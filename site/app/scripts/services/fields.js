'use strict';
angular.module('siteSeedApp').factory('Fields', function($resource, $q, APP_CONFIG) {
    return {
        list: function(projectId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.fields.list;
            var Field = $resource(url, {projectId: projectId, page: page, limit: limit});
            
            Field.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.fields.create;
            var Field = $resource(url);
            
            Field.save(data, function(res) {
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
        get: function(fieldId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.fields.get;
            var Fields = $resource(url, {fieldId: fieldId});
            
            Fields.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        remove: function(fieldId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.fields.delete;
            var Fields = $resource(url, {fieldId: fieldId});
            
            Fields.delete(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        update: function(fieldId, data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.fields.update;
            var Fields = $resource(url, {fieldId: fieldId}, {
                'update': { method: 'PUT' }
            });
            
            Fields.update(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
