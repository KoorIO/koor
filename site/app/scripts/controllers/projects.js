'use strict';
angular.module('siteSeedApp')
.controller('ListProjectCtrl', function($scope, $stateParams, Projects) {
    var page = $stateParams.page ? parseInt($stateParams.page) : 1,
        limit = $stateParams.limit ? parseInt($stateParams.limit) : 10;

    $scope.limit = limit;
    Projects.list(page, limit).then(function(data){
        $scope.projects = data.rows;
        $scope.count = data.count;
    });

    $scope.pageChanged = function() {
        Projects.list($scope.current_page, limit).then(function(response){
            $scope.projects = response.rows;
        });
    };

    $scope.forUnitTest = true;
})
.controller('ProjectDetailCtrl', function($scope, Projects, $stateParams, Apis) {
    var page = 1,
        limit = 10;

    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        Apis.list($scope.project._id, page, limit).then(function(res) {
            $scope.apis = res.rows;
            $scope.count = res.count;
        });
    });

    $scope.pageChanged = function() {
        Apis.list(projectId, page, limit).then(function(response){
            $scope.apis = response.rows;
        });
    };

    $scope.forUnitTest = true;
})
.controller('CreateProjectCtrl', function($scope, Projects, $state) {
    var pf = this;
    pf.create = function() {
        var data  = {
            name: pf.name
        };
        Projects.create(data).then(function() {
            $state.go('app.projects.list');
        });
    };
});
