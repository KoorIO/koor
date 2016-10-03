'use strict';
angular.module('siteSeedApp')
.controller('CreateFieldsCtrl', function($scope, Fields, $state, $stateParams) {
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
.controller('ViewFieldCtrl', function($scope, Fields, $state, $stateParams) {
    Fields.get($stateParams.fieldId).then(function(res) {
        $scope.field = res;
    });
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
});
