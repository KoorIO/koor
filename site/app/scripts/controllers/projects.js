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
        Projects.list($scope.currentPage, limit).then(function(response){
            $scope.projects = response.rows;
            $scope.count = response.count;
        });
    };

    $scope.forUnitTest = true;
})
.controller('ProjectDetailCtrl', function($scope, Projects, $stateParams, Apis, $uibModal, $state, $log) {
    var page = 1,
        limit = 10;

    $scope.limit = limit;
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        Apis.list($scope.project._id, page, limit).then(function(res) {
            $scope.apis = res.rows;
            $scope.count = res.count;
        });
    });

    $scope.pageChanged = function() {
        Apis.list($stateParams.projectId, $scope.currentPage, limit).then(function(response){
            $scope.apis = response.rows;
            $scope.count = response.count;
        });
    };

    $scope.delete = function(id) {
        var modalYesNo = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modalYesNo.html',
            controller: 'ModalYesNoCtrl'
        });
        modalYesNo.result.then(function() {
            Projects.remove(id).then(function() {
                $state.go('app.projects.list');
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteApi = function(index, apiId) {
        var modalUndo = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: false,
            templateUrl: 'modalUndo.html',
            controller: 'ModalUndoCtrl'
        });
        var tmp = $scope.apis[index];
        $scope.apis.splice(index, 1);
        $scope.count = $scope.count - 1;
        modalUndo.result.then(function() {
            $scope.apis.splice(index, 0, tmp);
        }, function () {
            Apis.remove(apiId).then(function() {
                $log.info('Api was deleted');
            });
        });
    };

    $scope.forUnitTest = true;
})
.controller('ModalYesNoCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('ModalUndoCtrl', function ($scope, $uibModalInstance, $timeout) {
    $scope.undo = function() {
        $uibModalInstance.close();
    }
    $timeout(function() {
        $uibModalInstance.dismiss('cancel');
    }, 5000);
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
