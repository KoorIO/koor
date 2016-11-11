'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
consumer.name = os.hostname() + 'users';

consumer.task = function(job, done){
    var data = job.data;
    var q = require('../queues');
    q.create(os.hostname() + 'esUsers', data).priority('high').save();
    q.create(os.hostname() + 'njUsers', data).priority('high').save();
    done();
};

module.exports = consumer;
