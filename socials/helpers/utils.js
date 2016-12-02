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

var mapUsersToObjects = function(users, rows) {
    for (var k in rows) {
        for (var j in users.rows) {
            if (String(users.rows[j]._id) === String(rows[k].userId)) {
                rows[k].user = users.rows[j];
                break;
            }
        }
    }
    return rows;
}

module.exports = {
    makeUrl: makeUrl,
    getHostnameSocials: getHostnameSocials,
    getHostnameWebsocket: getHostnameWebsocket,
    mapUsersToObjects: mapUsersToObjects
}
