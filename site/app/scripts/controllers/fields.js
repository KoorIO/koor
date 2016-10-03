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
        });
    };
})
.controller('ViewFieldCtrl', function($scope, Fields, $stateParams, $log) {
    var fieldId = $stateParams.fieldId;
    Fields.get(fieldId).then(function(res) {
        $scope.field = res;
    });
    $scope.updateField = function() {
        Fields.update(fieldId, $scope.field).then(function(r) {
            $scope.field.code = r.code;
        });
    };
});
