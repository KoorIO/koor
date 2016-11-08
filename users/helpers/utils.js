'use strict';
var makeUrl = function(url, params) {
    for (var param in params) {
        var myRegExp = new RegExp('\/\:' + param, 'g');
        url = url.replace(myRegExp, '/' + params[param]);
    }
    return url;
}

module.exports = {
    makeUrl: makeUrl
}
