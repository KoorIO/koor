'use strict';
var config = require('config');
var makeUrl = function(url, params) {
    for (var param in params) {
        var myRegExp = new RegExp('\/\:' + param, 'g');
        url = url.replace(myRegExp, '/' + params[param]);
    }
    return url;
}

var getHostnameSocials = function() {
    var items = config.get('hostnames.socials');
    return items[Math.floor(Math.random()*items.length)];
}

var getHostnameWebsocket = function() {
    var items = config.get('hostnames.websocket');
    return items[Math.floor(Math.random()*items.length)];
}

module.exports = {
    makeUrl: makeUrl,
    getHostnameSocials: getHostnameSocials,
    getHostnameWebsocket: getHostnameWebsocket
}
