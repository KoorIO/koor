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
            response: {
                headers: {
                    contentType: af.contentType,
                    contentEncoding: af.contentEncoding
                },
                status: af.responseStatus,
                body: JSON.parse(af.responseBody)
            }
        };
        Apis.create(data).then(function() {
            $state.go('app.projects.view', { projectId: projectId });
        });
    };
})
.controller('UpdateApiCtrl', function($scope, Apis, Projects, $state, $stateParams) {
    var af = this;
    var projectId = $stateParams.projectId;
    var apiId = $stateParams.apiId;
    Projects.get($stateParams.projectId).then(function(response) {
        $scope.project = response;
        Apis.get(apiId).then(function(res) {
            af.method = res.method;
            af.path = res.path;
            af.responseStatus = res.response.status;
            af.contentType = res.response.headers.contentType;
            af.contentEncoding = res.response.headers.contentEncoding;
            af.responseBody = JSON.stringify(res.response.body);
        });
    });

    af.update = function() {
        var data  = {
            path: af.path,
            projectId: projectId,
            name: af.method + ' ' + af.path,
            method: af.method,
            response: {
                headers: {
                    contentType: af.contentType,
                    contentEncoding: af.contentEncoding
                },
                status: af.responseStatus,
                body: JSON.parse(af.responseBody)
            }
        };
        Apis.update(apiId, data).then(function() {
            $state.go('app.projects.view', { projectId: projectId });
        });
    };
});
