'use strict';

// LoginCtrl
angular.module('siteSeedApp')
.controller('LoginCtrl', function(Users, $rootScope, $cookies, $state, APP_CONFIG) {
    var vm = this;
    // logout before login
    $rootScope.userInfo = {};
    $cookies.remove('userInfo');
    vm.login = function login() {
        Users.login(vm.username, vm.password).then(function(data){
            $rootScope.userInfo = data;
            $cookies.put('userInfo', JSON.stringify(data));
            vm.error = null;
            $state.go('app.projects.list');
        }).catch(function(){
            vm.error = 'Access Denied!';
        });
    };

    vm.connectGithub = function(){
        var url = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=' + 
        APP_CONFIG.github.clientId + '&redirect_url=' + APP_CONFIG.github.redirectUri;
        window.location.replace(url);
    };
})
.controller('SignInGithubCtrl', function(Users, $rootScope, $cookies, $state, APP_CONFIG, $log, Github) {
    //get query param
    var parseLocation = function(location) {
        var pairs = location.substring(1).split('&');
        var obj = {};
        var pair;
        var i;

        for ( i in pairs ) {
            if ( pairs[i] === '' ) {
                continue;
            }
            pair = pairs[i].split('=');
            obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
        }

        return obj;
    };

    var githubCode = parseLocation(window.location.search).code;
    var accessToken = $cookies.get('githubAccessToken');
    if (githubCode && !accessToken){
        Github.getAccessToken(githubCode).then(function(data){
            $rootScope.userInfo = data;
            $cookies.put('githubAccessToken', data.accessToken);
            $cookies.put('userInfo', JSON.stringify(data));
            $state.go('app.projects.list');
        }).catch(function(){
            $log.info('Access Denied!');
        });
    } else {
        $state.go('app.projects.list');
    }
});
