angular
.module('siteSeedApp', [
    'ngTouch',
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'ngAnimate',
    'ui.ace',
    'angular-loading-bar',
    'xeditable',
    'kmqtt',
    'ui.gravatar',
    'chart.js',
    'yaru22.angular-timeago',
    'ngFileUpload',
    'uiGmapgoogle-maps'
])  
/* jshint ignore:start */
.constant('APP_CONFIG', /* @echo APP_CONFIG */)
/* jshint ignore:end */
.value('debug', true);
