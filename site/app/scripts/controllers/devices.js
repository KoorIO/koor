'use strict';
angular.module('siteSeedApp')
.controller('CreateDeviceCtrl', function($scope, Devices, $state, $stateParams, uiGmapGoogleMapApi) {
    var projectId = $stateParams.projectId;
    $scope.create = function() {
        var data  = {
            name: $scope.name,
            projectId: projectId,
            description: $scope.description,
            address: $scope.address,
            lat: $scope.map.markers[0].latitude,
            long: $scope.map.markers[0].longitude
        };
        Devices.create(data).then(function() {
            $state.go('app.projects.view', { projectId: projectId , service: 'device'});
        }).catch(function() {
            $scope.message = 'Your Device Limit is 10.';
        });
    };
    var defaultLocation = {
        latitude: 21.0277644,
        longitude: 105.83415979999995
    };
    var defaultMarker = {
        id: 1,
        latitude: 21.0277644,
        longitude: 105.83415979999995
    };
    angular.extend($scope, {
        map: {
            center: defaultLocation,
            zoom: 14,
            markers: [defaultMarker],
            events: {
                click: function (map, eventName, originalEventArgs) {
                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(),lon = e.latLng.lng();
                    var marker = {
                        id: Date.now(),
                        latitude: lat,
                        longitude: lon
                    };
                    $scope.map.markers = [marker];
                    $scope.$apply();
                }
            },
            markersEvents: {
                click: function(marker, eventName, model) {
                    $scope.map.window.model = model;
                    $scope.map.window.show = true;
                }
            },
            window: {
                marker: {},
                show: false,
                closeClick: function() {
                    this.show = false;
                },
                options: {} 
            }
        },
        searchbox: { 
            template:'searchbox.tpl.html', 
            events:{
                places_changed: function (searchBox) {
                    var place = searchBox.getPlaces();
                    var lon = place[0].geometry.location.lng();
                    var lat = place[0].geometry.location.lat();
                    var marker = {
                        id: Date.now(),
                        latitude: lat,
                        longitude: lon
                    };
                    $scope.map.center = {
                        latitude: lat,
                        longitude: lon
                    };
                    $scope.map.markers = [marker];
                    $scope.$apply();
                }
            }
        },
        options: {
            scrollwheel: false
        }
    });

    uiGmapGoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
    });
})
.controller('LogsDeviceCtrl', function($scope, $stateParams, Socket, Projects,
    DeviceLogs, APP_CONFIG) {
    var deviceId = $stateParams.deviceId;
    $scope.logsNumber = 0;
    $scope.newDeviceLogs = [];
    Projects.get($stateParams.projectId).then(function(p) {
        var docs = (APP_CONFIG.localEnv)?APP_CONFIG.docs + p.domain:'http://' + p.domain + '/docs';
        docs = docs + '#!/Devices/post_devices_' + deviceId;
        $scope.swaggerUrl = 'http://petstore.swagger.io/?url=' + docs;
        $scope.project = p;
        DeviceLogs.list(deviceId, 1, 100).then(function(logs) {
            $scope.deviceLogs = logs.rows;
        });
        var socketDomain = (APP_CONFIG.localEnv)?APP_CONFIG.websocket:p.domain;
        var socket = Socket.connectDevices(deviceId, socketDomain);
        $scope.$on('$destroy', function() {
            socket.disconnect();
        });
        socket.on('device_logs', function(data) {
            $scope.logsNumber++;
            $scope.newDeviceLogs.unshift(data);
            $scope.$apply();
        });
    });
})
.controller('MqttDevicesCtrl', function($scope, Projects, $stateParams, $state, $log, kmqtt, APP_CONFIG) {
    var deviceId = $stateParams.deviceId;
    Projects.get($stateParams.projectId).then(function(res) {
        $scope.project = res;
        $scope.isOn = false;
        $scope.mqttMessage = 'Test messasge';
        $scope.channel = 'devices/' + deviceId;
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
.controller('ViewDeviceCtrl', function($scope, Devices, $stateParams, Socket, Projects,
    APP_CONFIG, uiGmapGoogleMapApi, $timeout) {
    var defaultLocation = {
        latitude: 21.0277644,
        longitude: 105.83415979999995
    };
    var defaultMarker = {
        id: 1,
        latitude: 21.0277644,
        longitude: 105.83415979999995
    };
    angular.extend($scope, {
        map: {
            center: defaultLocation,
            zoom: 14,
            markers: [defaultMarker],
            events: {
                click: function (map, eventName, originalEventArgs) {
                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(),lon = e.latLng.lng();
                    $scope.device.location.coordinates[0] = lon;
                    $scope.device.location.coordinates[1] = lat;
                    var marker = {
                        id: Date.now(),
                        latitude: lat,
                        longitude: lon
                    };
                    $scope.map.markers = [marker];
                    $scope.$apply();
                    $scope.updateDevice();
                }
            },
            markersEvents: {
                click: function(marker, eventName, model) {
                    $scope.map.window.model = model;
                    $scope.map.window.show = true;
                }
            },
            window: {
                marker: {},
                show: false,
                closeClick: function() {
                    this.show = false;
                },
                options: {} 
            }
        },
        searchbox: { 
            template:'searchbox.tpl.html', 
            events:{
                places_changed: function (searchBox) {
                    var place = searchBox.getPlaces();
                    var lon = place[0].geometry.location.lng();
                    var lat = place[0].geometry.location.lat();
                    $scope.device.location.coordinates[0] = lon;
                    $scope.device.location.coordinates[1] = lat;
                    var marker = {
                        id: Date.now(),
                        latitude: lat,
                        longitude: lon
                    };
                    $scope.map.center = {
                        latitude: lat,
                        longitude: lon
                    };
                    $scope.map.markers = [marker];
                    $scope.$apply();
                    $scope.updateDevice();
                }
            }
        },
        options: {
            scrollwheel: false
        }
    });

    uiGmapGoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
    });
    var deviceId = $stateParams.deviceId;
    Projects.get($stateParams.projectId).then(function(p) {
        $scope.project = p;
        Devices.get(deviceId).then(function(res) {
            $scope.device = res;
            var marker = {
                id: Date.now(),
                latitude: $scope.device.location.coordinates[1],
                longitude: $scope.device.location.coordinates[0]
            };
            $scope.map.center = {
                latitude: $scope.device.location.coordinates[1],
                longitude: $scope.device.location.coordinates[0]
            };
            $scope.map.markers = [marker];
            $timeout(function() {
                $scope.$apply();
            });
            var socketDomain = (APP_CONFIG.localEnv)?APP_CONFIG.websocket:p.domain;
            var socket = Socket.connectDevices(deviceId, socketDomain);
            $scope.$on('$destroy', function() {
                socket.disconnect();
            });
            socket.on('device_data', function(data) {
                if (data.deviceId === deviceId) {
                    $scope.device.status = data.status;
                    $scope.$apply();
                }
            });
        });
    });
    $scope.updateDevice = function() {
        Devices.update(deviceId, $scope.device).then(function(r) {
            $scope.device.code = r.code;
        });
    };
});
