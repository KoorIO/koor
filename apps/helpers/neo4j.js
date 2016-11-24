var config = require('config');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(config.get('neo4j.host'),
                          neo4j.auth.basic(config.get('neo4j.username'), config.get('neo4j.password')));

module.exports = driver;
