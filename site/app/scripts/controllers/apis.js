'use strict';
angular.module('siteSeedApp')
.controller('CreateApiCtrl', function($scope, Apis, Projects, $state, $stateParams) {
    var af = this;
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
    });
    af.create = function() {
        var data  = {
            name: pf.name
        };
        Projects.create(data).then(function() {
            $state.go('app.projects.list');
        });
    };
});
