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
        }).catch(function() {
            $scope.message = 'Your Field Limit is 10.';
        });
    };
})
.controller('ViewFieldCtrl', function($scope, Fields, $stateParams, Storages, Socket, Projects, APP_CONFIG) {
    var fieldId = $stateParams.fieldId;
    Projects.get($stateParams.projectId).then(function(p) {
        $scope.project = p;
        var docs = (APP_CONFIG.localEnv)?APP_CONFIG.docs + p.domain:'http://' + p.domain + '/docs';
        docs = docs + '#!/Fields/post_fields_' + fieldId;
        $scope.swaggerUrl = 'http://petstore.swagger.io/?url=' + docs;
        Fields.get(fieldId).then(function(res) {
            $scope.field = res;
            Storages.get(fieldId).then(function(storages) {
                $scope.field.labels = [];
                $scope.field.data = [];
                storages.forEach(function(s) {
                    if (parseInt(s.data)) {
                        $scope.field.data.push(parseInt(s.data));
                        $scope.field.labels.push('');
                    }
                });
            });
            var socketDomain = (APP_CONFIG.localEnv)?APP_CONFIG.websocket:p.domain;
            var socket = Socket.connectFields(socketDomain, $stateParams.fieldId);
            $scope.$on("$destroy", function() {
                socket.disconnect();
            });
            socket.on('field_data', function(data) {
                if (data.fieldId === fieldId) {
                    $scope.field.data.push(parseInt(data.value));
                    $scope.field.labels.push('');
                    $scope.$apply();
                }
            });
        });
    });
    $scope.updateField = function() {
        Fields.update(fieldId, $scope.field).then(function(r) {
            $scope.field.code = r.code;
        });
    };
})
.controller('MqttFieldCtrl', function($scope, Projects, $stateParams, $state, $log, kmqtt, APP_CONFIG) {
    var fieldCode = $stateParams.fieldCode;
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        $scope.isOn = false;
        $scope.mqttMessage = '1';
        $scope.channel = 'fields/' + fieldCode;
        var mqttDomain = (APP_CONFIG.localEnv)?APP_CONFIG.mqtt:res.domain;
        var client = kmqtt.connect(APP_CONFIG.protocols.ws + mqttDomain + '/mqtt');
        $scope.$on("$destroy", function() {
            client.end();
        });

        $scope.inbox = [];
        client.on("message", function(topic, payload) {
            var data = {
                time: new Date(new Date().getTime()).toLocaleString(),
                message: payload.toString()
            };
            $scope.inbox.push(data);
            $scope.$apply();
        });

        $scope.subscribe = function() {
            $scope.isOn = true;
            client.subscribe(res.domain + '/' + $scope.channel);
        };
        $scope.subscribe();

        $scope.unsubscribe = function() {
            $scope.isOn = false;
            client.unsubscribe(res.domain + '/' + $scope.channel);
        };

        $scope.publish = function() {
            client.publish(res.domain + '/' + $scope.channel, $scope.mqttMessage);
        };
        $scope.loaded = true;
    });
})
