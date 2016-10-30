'use strict';
angular.module('siteSeedApp').factory('DeviceLogs', function($resource, $q, APP_CONFIG) {
    return {
        list: function(deviceId, page, limit){
            var deferred = $q.defer();
            var url = APP_CONFIG.services.deviceLogs.list;
            var DeviceLog = $resource(url, {deviceId: deviceId, page: page, limit: limit});
            
            DeviceLog.get(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    };
});
