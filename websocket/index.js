'use strict';

var config = require('config');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var logger = require('./helpers/logger');
var app = express();

//Server's IP address
app.set("host", config.get('server.host'));
//Server's port number
app.set("port", config.get('server.port'));
//Tells server to support JSON requests
app.use(bodyParser.json());
// set views
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var adapter = require('socket.io-redis');
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');
var pub = redis({
    host: config.get('redis.host'), 
    port: config.get('redis.port'), 
    prefix: config.get('redis.prefix'), 
    auth_pass: config.get('redis.password') 
});
var sub = redis({
    host: config.get('redis.host'), 
    port: config.get('redis.port'), 
    prefix: config.get('redis.prefix'), 
    return_buffers: true, 
    auth_pass: config.get('redis.password') 
});

app.get('/', function (req, res) {
    res.render('index');
});

// Start web server at port 3000
var io = require('socket.io').listen(app.listen(app.get("port"), app.get("host"), function () {
        logger.info("Server up and running. Go to http://" + app.get("host") + ":" + app.get("port"));
}));
io.adapter(adapter({ key: config.get('redis.prefix'), pubClient: pub, subClient: sub }));

// Room sockets
require('./websockets/room')(io); 
