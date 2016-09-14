'use strict';
var express = require('express'), 
    logger = require('../helpers/logger'),
    router = express.Router();

// auth on register
router.post('/auth_on_register', function(req, res){
    logger.debug('Auth On Register');
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        req.rawBody += chunk;
        res.send(JSON.stringify({result: 'ok'}));
    });
});

// auth on subscribe
router.post('/auth_on_subscribe', function(req, res){
    req.setEncoding('utf8');
    logger.debug('Auth On Subscribe');
    req.on('data', function(chunk) {


        req.rawBody += chunk;
        res.send(JSON.stringify({result: 'ok'}));
    });
});

// auth on publish
router.post('/auth_on_publish', function(req, res){
    logger.debug('Auth On Publish');
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        req.rawBody += chunk;
        res.send(JSON.stringify({result: 'ok'}));
    });
});

module.exports = router;
