'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var utils = require('../helpers/utils');
var services = require('../services');
consumer.name = os.hostname() + 'posts';

consumer.task = function(job, done) {
  var data = job.data;
  logger.debug('Post Worker', data.postId);
  var q = require('../queues');
  services.User.getUserById(data).then(function(user) {
    services.Post.getPostById(data).then(function(post) {
      if (post._id && user._id) {
        data.data.user = user;
        data.data.object = post;

                // save feed
        if (data.type === 'CREATE_POST') {
          var feed = {
            data: data.data,
            objectType: 'POST',
            objectId: data.data._id,
            type: data.type,
            userId: data.userId
          };
          q.create(utils.getHostnameSocials() + 'feeds', feed).priority('low').save();
        }
      }
    }).catch(function(e) {
      logger.error('Failed - get post detail', e);
    });
  }).catch(function(e) {
    logger.error('Failed - get user detail', e);
  });

  done();
};

module.exports = consumer;
