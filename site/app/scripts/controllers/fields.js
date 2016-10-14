'use strict';
angular.module('siteSeedApp')
.controller('CreateFieldCtrl', function($scope, Fields, $state, $stateParams) {
    var projectId = $stateParams.projectId;
    $scope.create = function() {
        var data  = {
            name: $scope.name,
            projectId: projectId,
            description: $scope.description
        };
        Fields.create(data).then(function() {
            $state.go('app.projects.view', { projectId: projectId , service: 'field'});
        }).catch(function() {
            $scope.message = 'Your Field Limit is 10.';
        });
    };
})
.controller('ViewFieldCtrl', function($scope, Fields, $stateParams, Storages, Socket, Projects) {
    var fieldId = $stateParams.fieldId;
    Projects.get($stateParams.projectId).then(function(p) {
        Fields.get(fieldId).then(function(res) {
            $scope.field = res;
            Storages.get(fieldId).then(function(storages) {
                $scope.field.labels = [];
                $scope.field.data = [];
                storages.forEach(function(s) {
                    if (parseInt(s.data)) {
                        $scope.field.data.push(parseInt(s.data));
                        $scope.field.labels.push('');
                    }
                });
            });
            var socket = Socket.connect(p.domain);
            $scope.$on("$destroy", function() {
                socket.disconnect();
            });
            socket.on('field_data', function(data) {
                if (data.fieldId === fieldId) {
                    $scope.field.data.push(parseInt(data.value));
                    $scope.field.labels.push('');
                    $scope.$apply();
                }
            });
        });
    });
    $scope.updateField = function() {
        Fields.update(fieldId, $scope.field).then(function(r) {
            $scope.field.code = r.code;
        });
    };
});
