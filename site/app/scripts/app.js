'use strict';

/**
 * @ngdoc overview
 * @name siteSeedApp
 * @description
 * # siteSeedApp
 *
 * Main module of the application.
 */
angular
.module('siteSeedApp') 
.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])
.config(function ($translateProvider, APP_CONFIG) {
    if (APP_CONFIG.debug_mode) {
        $translateProvider.useMissingTranslationHandlerLog();
    }

    $translateProvider.useStaticFilesLoader({
        files: [
            {
                prefix: 'resources/locale-',
                suffix: '.json'
            }
        ]
    });

    $translateProvider.preferredLanguage(APP_CONFIG.locales.preferredLocale);
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useLocalStorage();
})
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAaTopiIVMSyOvZlbffo8ykyuUIhD-44P4',
        v: '3.25', //defaults to latest 3.X anyhow
        libraries: 'places' // Required for SearchBox.
    });
})
.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$ocLazyLoadProvider', 
    '$httpProvider',
    function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $httpProvider) {

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
        });

        $urlRouterProvider.otherwise('/loading');

        $stateProvider
        .state('login',{
            templateUrl: 'views/pages/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm',
            url: '/login',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/login.js',
                                'scripts/services/users.js',
                                'scripts/services/github.js'
                            ]
                        });
                }
            }
        })
        .state('github',{
            templateUrl: 'views/pages/loading.html',
            controller: 'SignInGithubCtrl',
            url: '/github',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/login.js',
                                'scripts/services/users.js',
                                'scripts/services/github.js'
                            ]
                        });
                }
            }
        })
        .state('resetpassword',{
            templateUrl:'views/pages/resetpassword.html',
            controller: 'ResetPasswordCtrl',
            controllerAs: 'fp',
            url:'/resetpassword/:token',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'sbAdminApp',
                            files:[
                                'scripts/controllers/register.js',
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('forgotpassword',{
            templateUrl:'views/pages/forgotpassword.html',
            controller: 'ForgotPasswordCtrl',
            controllerAs: 'fp',
            url:'/forgotpassword',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'sbAdminApp',
                            files:[
                                'scripts/controllers/register.js',
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('register',{
            templateUrl:'views/pages/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'vs',
            url:'/register',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'sbAdminApp',
                            files:[
                                'scripts/controllers/register.js',
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('thankyou',{
            templateUrl:'views/pages/thankyou.html',
            url:'/thankyou'
        })
        .state('loading',{
            templateUrl:'views/pages/loading.html',
            url:'/loading',
            controller: 'LoadingCtrl',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'sbAdminApp',
                            files:[
                                'scripts/controllers/loading.js'
                            ]
                        });
                }
            }
        })
        .state('postforgotpassword',{
            templateUrl:'views/pages/postforgotpassword.html',
            url:'/postforgotpassword'
        })
        .state('postresetpassword',{
            templateUrl:'views/pages/postresetpassword.html',
            url:'/postresetpassword'
        })
        .state('activate',{
            templateUrl:'views/pages/activate.html',
            controller: 'ActivateCtrl',
            url:'/activate/:token',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'sbAdminApp',
                            files:[
                                'scripts/controllers/register.js',
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('app', {
            url: '/app',
            templateUrl: 'views/app.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/directives/header/header.js',
                                'scripts/services/notifications.js',
                                'scripts/services/socket.js',
                                'scripts/services/locale.js',
                                'scripts/directives/locale/locale.js',
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('app.projects', {
            url: '/projects',
            templateUrl: 'views/projects/index.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/services/projects.js',
                                'scripts/services/activities.js',
                                'scripts/services/notifications.js',
                                'scripts/services/storages.js',
                                'scripts/services/fields.js',
                                'scripts/services/devices.js',
                                'scripts/services/socket.js',
                                'scripts/controllers/projects.js',
                                'scripts/services/apis.js'
                            ]
                        });
                }
            }
        })
        .state('app.projects.list', {
            url: '/list',
            controller: "ListProjectCtrl",
            templateUrl: 'views/projects/list.html'
        })
        .state('app.projects.websocket', {
            url: '/websocket/:projectId/:socketId',
            controller: "WebsocketProjectCtrl",
            templateUrl: 'views/projects/websocket.html'
        })
        .state('app.projects.mqtt', {
            url: '/mqtt/:projectId',
            controller: "MqttProjectCtrl",
            templateUrl: 'views/projects/mqtt.html'
        })
        .state('app.projects.create', {
            url: '/create',
            controllerAs: 'pf',
            controller: 'CreateProjectCtrl',
            templateUrl: 'views/projects/create.html'
        })
        .state('app.projects.view', {
            url: '/view/:projectId/:service',
            controller: 'ProjectDetailCtrl',
            templateUrl: 'views/projects/view.html'
        })
        .state('app.projects.update', {
            url: '/update',
            templateUrl: 'views/projects/udpate.html'
        })
        .state('app.devices', {
            url: '/:projectId/devices',
            templateUrl: 'views/apis/index.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/services/devices.js',
                                'scripts/services/deviceLogs.js',
                                'scripts/services/projects.js',
                                'scripts/services/socket.js',
                                'scripts/controllers/devices.js'
                            ]
                        });
                }
            }
        })
        .state('app.devices.mqtt', {
            url: '/mqtt/:deviceId',
            controller: "MqttDevicesCtrl",
            templateUrl: 'views/devices/mqtt.html'
        })
        .state('app.devices.view', {
            url: '/view/:deviceId',
            controller: 'ViewDeviceCtrl',
            templateUrl: 'views/devices/view.html'
        })
        .state('app.devices.logs', {
            url: '/logs/:deviceId',
            controller: 'LogsDeviceCtrl',
            templateUrl: 'views/devices/logs.html'
        })
        .state('app.devices.create', {
            url: '/create',
            templateUrl: 'views/devices/create.html',
            controller: 'CreateDeviceCtrl'
        })
        .state('app.fields', {
            url: '/:projectId/fields',
            templateUrl: 'views/apis/index.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/services/fields.js',
                                'scripts/services/projects.js',
                                'scripts/services/storages.js',
                                'scripts/services/socket.js',
                                'scripts/controllers/fields.js'
                            ]
                        });
                }
            }
        })
        .state('app.fields.view', {
            url: '/view/:fieldId',
            controller: 'ViewFieldCtrl',
            templateUrl: 'views/fields/view.html'
        })
        .state('app.fields.mqtt', {
            url: '/mqtt/:fieldCode',
            controller: 'MqttFieldCtrl',
            templateUrl: 'views/fields/mqtt.html'
        })
        .state('app.fields.create', {
            url: '/create',
            templateUrl: 'views/fields/create.html',
            controller: 'CreateFieldCtrl'
        })
        .state('app.apis', {
            url: '/:projectId/apis',
            templateUrl: 'views/apis/index.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/services/apis.js',
                                'scripts/services/projects.js',
                                'scripts/controllers/apis.js'
                            ]
                        });
                }
            }
        })
        .state('app.apis.list', {
            url: '/list',
            templateUrl: 'views/apis/list.html'
        })
        .state('app.apis.create', {
            url: '/create',
            templateUrl: 'views/apis/create.html',
            controllerAs: 'af',
            controller: 'CreateApiCtrl'
        })
        .state('app.apis.update', {
            url: '/update/:apiId',
            controllerAs: 'af',
            controller: 'UpdateApiCtrl',
            templateUrl: 'views/apis/update.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('user', {
            url: '/user',
            templateUrl: 'views/user.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/directives/header/header.js',
                                'scripts/directives/sidebar/sidebar-user.js',
                                'scripts/services/notifications.js',
                                'scripts/services/socket.js',
                                'scripts/services/locale.js',
                                'scripts/directives/locale/locale.js',
                                'scripts/services/users.js',
                                'scripts/services/followers.js',
                                'scripts/services/feeds.js',
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('user.get', {
            url: '/get/:userId',
            controller: 'UserDetailCtrl',
            templateUrl: 'views/users/view.html',
            resolve: {
                loadMyDirectives: function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('user.follower', {
            url: '/follower/:userId',
            controller: 'UserFollowerCtrl',
            templateUrl: 'views/users/follower.html',
            resolve: {
                loadMyDirectives: function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('user.following', {
            url: '/following/:userId',
            controller: 'UserFollowingCtrl',
            templateUrl: 'views/users/following.html',
            resolve: {
                loadMyDirectives: function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('home', {
            url: '/home',
            templateUrl: 'views/main.html',
            resolve: {
                loadMyDirectives:function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/directives/header/header.js',
                                'scripts/directives/sidebar/sidebar.js',
                                'scripts/controllers/users.js',
                                'scripts/services/locale.js',
                                'scripts/directives/locale/locale.js',
                                'scripts/services/notifications.js',
                                'scripts/services/socket.js',
                                'scripts/services/files.js',
                                'scripts/services/users.js',
                                'scripts/services/feeds.js',
                                'scripts/services/posts.js',
                                'scripts/services/followers.js'
                            ]
                        });
                }
            }
        })
        .state('home.profiles', {
            url: '/profiles',
            controller: 'UserProfileCtrl',
            templateUrl: 'views/profiles/view.html'
        })
        .state('home.settings', {
            url: '/settings',
            templateUrl: 'views/profiles/setting.html'
        })
        .state('home.index', {
            url: '/index',
            controller: 'HomeIndexCtrl',
            templateUrl: 'views/profiles/index.html',
            activetab: 'home'
        })
        .state('home.follower', {
            url: '/follower',
            controller: 'HomeFollowerCtrl',
            templateUrl: 'views/profiles/follower.html'
        })
        .state('home.following', {
            url: '/following',
            controller: 'HomeFollowingCtrl',
            templateUrl: 'views/profiles/following.html'
        })
        .state('home.findYourFriend', {
            url: '/findYourFriend',
            controller: 'HomeFindYourFriendCtrl',
            templateUrl: 'views/profiles/findYourFriend.html'
        })
        .state('home.users', {
            url: '/users/list/{page}/{limit}',
            controller: 'ListUserCtrl',
            templateUrl: 'views/users/list.html',
            resolve: {
                loadMyDirectives: function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('home.user_get', {
            url: '/users/get/:userId',
            controller: 'UserProfileCtrl',
            templateUrl: 'views/profiles/view.html',
            resolve: {
                loadMyDirectives: function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('home.user_setting',{
            templateUrl:'views/users/setting.html',
            url:'/users/setting',
        });
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }
])
.run(['$state', '$rootScope', function($state, $rootScope){
    $rootScope.$on('unauthorized', function() {
        $state.go('login');
    });
}])
.factory('httpRequestInterceptor', function ($rootScope, $cookies) {
    var ret = {
        request: function (config) {
            var userInfo = $cookies.get('userInfo') || '{}';
            $rootScope.userInfo = JSON.parse(userInfo);
            config.headers.Authorization = 'Bearer ' + $rootScope.userInfo.token;
            return config;
        }
    };
    ret.responseError = function(response){
        if ('data' in response && response.data) {
            response.data.errorCode = response.status;
        }
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
    return ret;
})
.run(function(editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
});
