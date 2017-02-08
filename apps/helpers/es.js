'use strict';
var elasticsearch = require('elasticsearch'),
  config = require('config');

var es = new elasticsearch.Client({
  host: config.get('es.host')
});
module.exports = es;
