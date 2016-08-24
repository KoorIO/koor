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
    $translateProvider.useLocalStorage();
})
.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$ocLazyLoadProvider', 
    '$httpProvider',
    function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $httpProvider) {

        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
        });

        $urlRouterProvider.otherwise('/app/projects/list');

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
            templateUrl: 'views/pages/login.html',
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
        .state('app.projects.create', {
            url: '/create',
            controllerAs: 'pf',
            controller: 'CreateProjectCtrl',
            templateUrl: 'views/projects/create.html'
        })
        .state('app.projects.view', {
            url: '/view/:projectId',
            controller: 'ProjectDetailCtrl',
            templateUrl: 'views/projects/view.html'
        })
        .state('app.projects.update', {
            url: '/update',
            templateUrl: 'views/projects/udpate.html'
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
                                'scripts/services/locale.js',
                                'scripts/directives/locale/locale.js',
                                'scripts/services/users.js',
                                'scripts/controllers/users.js'
                            ]
                        });
                }
            }
        })
        .state('user.profiles', {
            url: '/profiles',
            controller: 'UserProfileCtrl',
            templateUrl: 'views/profiles/view.html'
        })
        .state('user.settings', {
            url: '/settings',
            templateUrl: 'views/profiles/setting.html'
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
                                'scripts/services/locale.js',
                                'scripts/directives/locale/locale.js',
                                'scripts/services/users.js'
                            ]
                        });
                }
            }
        })
        .state('home.dashboard', {
            url: '/dashboard',
            controller: 'MainCtrl',
            templateUrl: 'views/dashboard/home.html',
            resolve: {
                loadMyDirectives: function($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            name:'siteSeedApp',
                            files:[
                                'scripts/controllers/main.js'
                            ]
                        });
                }
            }
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
        .state('home.user_setting',{
            templateUrl:'views/users/setting.html',
            url:'/users/setting',
        });
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }
])
.factory('httpRequestInterceptor', function ($rootScope, $cookies) {
    var ret = {
        request: function (config) {
            var userInfo = $cookies.get('userInfo') || '{}';
            $rootScope.userInfo = JSON.parse(userInfo);
            config.headers.Authorization = 'Bearer ' + $rootScope.userInfo.token;
            return config;
        }
    };
    return ret;
})
.run(function(editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
});

