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
.controller('ProjectDetailCtrl', function($scope, Projects, $stateParams) {
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
    });
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
