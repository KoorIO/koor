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

    af.headers = [];
    af.addHeader = function() {
        af.headers.push({
            key: '',
            value: ''
        });
    };
    af.removeHeader = function(k) {
        af.headers.splice(k,1);
    };

    af.create = function() {

        var headers = {
            'Content-Type': af.contentType,
            'Content-Encoding': af.contentEncoding
        };
        af.headers.forEach(function(item) {
            headers[item.key] = item.value;
        });

        var data  = {
            path: af.path,
            projectId: projectId,
            name: af.method + ' ' + af.path,
            method: af.method,
            response: {
                headers: headers,
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

    af.headers = [];
    af.addHeader = function() {
        af.headers.push({
            key: '',
            value: ''
        });
    };
    af.removeHeader = function(k) {
        af.headers.splice(k,1);
    };

    Projects.get($stateParams.projectId).then(function(response) {
        $scope.project = response;
        Apis.get(apiId).then(function(res) {
            af.method = res.method;
            af.path = res.path;
            af.responseStatus = res.response.status;
            af.contentType = res.response.headers['Content-Type'];
            af.contentEncoding = res.response.headers['Content-Encoding'];
            var responseBody = res.response.body || {};
            af.responseBody = JSON.stringify(responseBody, null, '\t');
            Object.keys(res.response.headers).forEach(function(key) {
                if (key !== 'Content-Type' && key !== 'Content-Encoding') {
                    af.headers.push({
                        key: key,
                        value: res.response.headers[key]
                    });
                }
            });
        });
    });

    af.update = function() {
        var headers = {
            'Content-Type': af.contentType,
            'Content-Encoding': af.contentEncoding
        };
        af.headers.forEach(function(item) {
            headers[item.key] = item.value;
        });
        var data  = {
            path: af.path,
            projectId: projectId,
            name: af.method + ' ' + af.path,
            method: af.method,
            response: {
                headers: headers,
                status: af.responseStatus,
                body: JSON.parse(af.responseBody)
            }
        };
        Apis.update(apiId, data).then(function() {
            $state.go('app.projects.view', { projectId: projectId });
        });
    };
});
