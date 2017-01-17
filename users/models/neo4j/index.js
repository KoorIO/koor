'use strict';
var fs = require('fs'),
    path = require('path'),
    nj = {};

// import all file in this dir, except index.js
fs.readdirSync(__dirname)
.filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach(function(file) {
    var model = require(path.join(__dirname, file));
    nj[model.modelName] = model;
});

module.exports = nj;
