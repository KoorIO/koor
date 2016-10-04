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
.controller('WebsocketProjectCtrl', function($scope, Projects, $stateParams, $state, $log, Socket) {
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        var socket = Socket.connect(res.domain);
        $scope.messages = [];
        socket.on('test_message', function(data) {
            data.time = new Date(new Date().getTime()).toLocaleString();
            data.socketId = $stateParams.socketId;
            $scope.messages.push(data);
            $scope.$apply();
        });
        $scope.sendMessage = function() {
            var message = {
                message: $scope.message,
                socketId: 'me',
                time: new Date(new Date().getTime()).toLocaleString()
            };
            socket.emit('test_message', {
                message: $scope.message,
                socketId: $stateParams.socketId
            });
            $scope.messages.push(message);
        };
    });
})
.controller('MqttProjectCtrl', function($scope, Projects, $stateParams, $state, $log, kmqtt, APP_CONFIG) {
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        $scope.channelSubscribe = 'mqtt/demo';
        $scope.channelPublish = 'mqtt/demo';
        var client = kmqtt.connect(APP_CONFIG.protocols.ws + res.domain + '/mqtt');

        $scope.inbox = [];
        client.on("message", function(topic, payload) {
            var data = {
                time: new Date(new Date().getTime()).toLocaleString(),
                message: payload.toString()
            };
            $scope.inbox.push(data);
            $scope.$apply();
        });

        $scope.publish = function() {
            client.subscribe(res.domain + '/' + $scope.channelSubscribe);
            client.publish(res.domain + '/' + $scope.channelPublish, $scope.mqttMessage);
        };
    });
})
.controller('ProjectDetailCtrl', function($scope, Projects, $stateParams, Apis, $uibModal,
                                          $state, $log, Socket, kmqtt, APP_CONFIG, Storages, Fields) {
    var page = 1,
        limit = 10;
    $scope.service = $stateParams.service || 'dashboard';

    $scope.limit = limit;
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        $scope.channelSubscribe = res.domain + '/mqtt/demo';
        var client = kmqtt.connect(APP_CONFIG.protocols.ws + res.domain + '/mqtt');
        client.subscribe($scope.channelSubscribe);

        $scope.inbox = [];
        client.on("message", function(topic, payload) {
            var data = {
                time: new Date(new Date().getTime()).toLocaleString(),
                message: payload.toString()
            };
            $scope.inbox.push(data);
            $scope.$apply();
        });

        var socket = Socket.connect(res.domain);
        socket.on('clients', function(data) {
            $scope.sockets = data.filter(function(item) {
                return item.id !== socket.id;
            });
            $scope.$apply();
        });

        Apis.list($scope.project._id, page, limit).then(function(res) {
            $scope.apis = res.rows;
            $scope.count = res.count;
        });

        $scope.sendBroadcastMessage = function() {
            var modalSocket = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modalSocket.html',
                controller: 'ModalSocketCtrl',
                resolve: {
                    socket: function () {
                        return socket;
                    }
                }
            });
            modalSocket.result.then(function() {
                $log.info('Sent Broadcast ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        Fields.list($scope.project._id, 1, 10).then(function(fields) {
            $scope.fields = fields.rows;
            $scope.fields.forEach(function(field) {
                Storages.get(field._id).then(function(storages) {
                    field.labels = [];
                    field.data = [];
                    storages.forEach(function(s) {
                        if (parseInt(s.data)) {
                            field.data.push(parseInt(s.data));
                            field.labels.push('');
                        }
                    });
                });
            });
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
            keyboard: false,
            openedClass: 'modal-undo',
            templateUrl: 'modalUndo.html',
            controller: 'ModalUndoCtrl'
        });
        var tmp = $scope.apis[index];
        $scope.apis.splice(index, 1);
        $scope.count = $scope.count - 1;
        modalUndo.result.then(function() {
            $scope.apis.splice(index, 0, tmp);
            $scope.count = $scope.count + 1;
        }, function () {
            Apis.remove(apiId).then(function() {
                $log.info('Api was deleted');
            });
        });
    };

    $scope.forUnitTest = true;
})
.controller('ModalSocketCtrl', function ($scope, $uibModalInstance, socket) {
    $scope.send = function () {
        socket.emit('broadcast_message', $scope.socketMessage);
        $uibModalInstance.close();
    };

    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
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
    };
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
        }).catch(function() {
            pf.error = 'You created Project exceed Project Limit';
        });
    };
});
