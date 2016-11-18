'use strict';
var fs = require('fs'),
    path = require('path'),
    services = {};

// import all file in this dir, except index.js
fs.readdirSync(__dirname)
.filter(function(file){
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach(function(file){
    var service = require(path.join(__dirname, file));
    services[service.serviceName] = service;
});

module.exports = services;
