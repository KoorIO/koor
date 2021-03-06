'use strict';

var express = require('express');
var fs = require('fs');
var config = require('config');
var app = express();
var bodyParser = require('body-parser');
var logger = require('./helpers/logger');
var yaml = require('js-yaml');
var validator = require('express-validator');

// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator({}));

// add modification header
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Swagger Docs
app.get('/docs', function(req, res) {
  var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml', 'utf8'));
  res.send(JSON.stringify(docs));
});

// import middlewares
app.use(require('./middlewares/auth'));
app.use(require('./middlewares/checkin'));

// import routers
app.use(require('./apis'));

// handle error
app.use(require('./middlewares/error'));

// start server
var server = app.listen(config.get('server.port'), config.get('server.host'), function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info('Server start at http://%s:%s', host, port);
});

module.exports = app;
