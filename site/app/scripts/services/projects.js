'use strict';
angular.module('siteSeedApp').factory('Projects', function($resource, $q, APP_CONFIG) {
    return {
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.projects.create;
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
        },
        list: function(page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.projects.list;
            var Projects = $resource(url, {limit: limit, page: page});
            
            Projects.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        get: function(projectId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.projects.get;
            var Projects = $resource(url, {projectId: projectId});
            
            Projects.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        generateSecretKey: function(){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.projects.generateSecretKey;
            var Projects = $resource(url);
            
            Projects.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        remove: function(projectId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.projects.delete;
            var Projects = $resource(url, {projectId: projectId});
            
            Projects.delete(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        update: function(projectId, data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.projects.update;
            var Projects = $resource(url, {projectId: projectId}, {
                'update': { method: 'PUT' }
            });

            Projects.update(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
