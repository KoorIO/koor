'use strict';
var makeUrl = function(url, params) {
    for (var param in params) {
        var myRegExp = new RegExp('\/\:' + param, 'g');
        url = url.replace(myRegExp, '/' + params[param]);
    }
    return url;
}

var getHostnameSocials = function() {
    return 'socials';
}

var getHostnameWebsocket = function() {
    return 'websocket';
}

module.exports = {
    makeUrl: makeUrl,
    getHostnameSocials: getHostnameSocials,
    getHostnameWebsocket: getHostnameWebsocket
}
