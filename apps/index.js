'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var config = require('config');
var app = express();
var bodyParser = require('body-parser');
var logger = require('./helpers/logger');

// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// add modification header
app.use(function(req, res, next){
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// import middlewares
app.use(require('./middlewares/auth'));

// import routers
app.use(require('./apis'));

// start server
var server = app.listen(config.get('server.port'), config.get('server.host'), function () {
    var host = server.address().address;
    var port = server.address().port;
    logger.info('Server start at http://%s:%s', host, port);
});

module.exports = app;
