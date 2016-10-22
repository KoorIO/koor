'use strict';
angular.module('siteSeedApp')
.controller('CreateDeviceCtrl', function($scope, Devices, $state, $stateParams) {
    var projectId = $stateParams.projectId;
    $scope.create = function() {
        var data  = {
            name: $scope.name,
            projectId: projectId,
            description: $scope.description
        };
        Devices.create(data).then(function() {
            $state.go('app.projects.view', { projectId: projectId , service: 'device'});
        }).catch(function() {
            $scope.message = 'Your Device Limit is 10.';
        });
    };
})
.controller('ViewDeviceCtrl', function($scope, Devices, $stateParams, Storages, Socket, Projects) {
    var deviceId = $stateParams.deviceId;
    Projects.get($stateParams.projectId).then(function(p) {
        $scope.project = p;
        Devices.get(deviceId).then(function(res) {
            $scope.device = res;
            var socket = Socket.connect(p.domain);
            $scope.$on("$destroy", function() {
                socket.disconnect();
            });
            socket.on('device_data', function(data) {
                if (data.deviceId === deviceId) {
                    $scope.device.data.push(parseInt(data.value));
                    $scope.device.labels.push('');
                    $scope.$apply();
                }
            });
        });
    });
    $scope.updateDevice = function() {
        Devices.update(deviceId, $scope.device).then(function(r) {
            $scope.device.code = r.code;
        });
    };
});
