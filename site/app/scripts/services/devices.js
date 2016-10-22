'use strict';
angular.module('siteSeedApp').factory('Devices', function($resource, $q, APP_CONFIG) {
    return {
        list: function(projectId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.devices.list;
            var Device = $resource(url, {projectId: projectId, page: page, limit: limit});
            
            Device.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        create: function(data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.devices.create;
            var Device = $resource(url);
            
            Device.save(data, function(res) {
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
        get: function(deviceId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.devices.get;
            var Devices = $resource(url, {deviceId: deviceId});
            
            Devices.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        remove: function(deviceId){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.devices.delete;
            var Devices = $resource(url, {deviceId: deviceId});
            
            Devices.delete(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },
        update: function(deviceId, data){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.devices.update;
            var Devices = $resource(url, {deviceId: deviceId}, {
                'update': { method: 'PUT' }
            });
            
            Devices.update(data, function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
