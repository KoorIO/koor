'use strict';
angular.module('siteSeedApp')
.controller('CreateApiCtrl', function($scope, Apis, Projects, $state, $stateParams) {
    var af = this;
    var projectId = $stateParams.projectId;
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
    });

    af.method = 'GET';
    af.responseStatus = '200';
    af.contentType = 'application/json';
    af.contentEncoding = 'UTF-8';
    af.responseBody = JSON.stringify({});
    af.create = function() {
        var data  = {
            path: af.path,
            projectId: projectId,
            name: af.method + ' ' + af.path,
            method: af.method,
            headers: {
                contentType: af.contentType,
                contentEncoding: af.contentEncoding
            },
            response: JSON.parse(af.responseBody)
        };
        Apis.create(data).then(function() {
            $state.go('app.projects.view', { projectId: projectId });
        });
    };
});
