'use strict';
var fs = require('fs'),
    path = require('path'),
    es = {};

// import all file in this dir, except index.js
fs.readdirSync(__dirname)
.filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach(function(file) {
    var search = require(path.join(__dirname, file));
    es[search.searchName] = search;
});

module.exports = es;
