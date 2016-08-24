angular
.module('siteSeedApp', [
    'ngTouch',
    'ngResource',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'ngAnimate',
    'ui.ace',
    'angular-loading-bar',
    'xeditable'
])  
/* jshint ignore:start */
.constant('APP_CONFIG', /* @echo APP_CONFIG */)
/* jshint ignore:end */
.value('debug', true);
