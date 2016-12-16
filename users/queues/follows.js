'use strict';
var config = require('config');
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var es = require('../helpers/es');
var utils = require('../helpers/utils');
var services = require('../services');
var driver = require('../helpers/neo4j');

consumer.name = os.hostname() + 'follows';

consumer.task = function(job, done){
    var data = job.data;
    var q = require('../queues');
    services.User.getUserById({
        userId: data.followerId,
        accessToken: data.accessToken
    }).then(function(follower) {
        services.User.getUserById({
            userId: data.userId,
            accessToken: data.accessToken
        }).then(function(user) {
            var feedData = {
                type: 'FOLLOW_USER',
                objectType: 'FOLLOWER',
                objectId: data.id,
                data: { user: user, follower: follower },
                userId: data.followerId
            };
            q.create(utils.getHostnameSocials() + 'feeds', feedData).priority('high').save();
            q.create(utils.getHostnameSocials() + 'notifications', {
                type: 'FOLLOW_USER',
                objectId: data.id,
                objectType: 'FOLLOWER',
                userId: data.userId,
                data: { user: user, follower: follower },
            }).priority('high').save();

            // send new follower email
            q.create(os.hostname() + 'email', {
                title: '[Koor.IO] You have a new follower',
                to: user.email,
                emailContent: {
                    username: user.firstname,
                    url: config.get('client.url') + '#/user/get/' + follower._id
                },
                template: 'follower'
            }).priority('high').save();

        });
    });
    q.create(os.hostname() + 'njFollows', data).priority('high').save();

    done();
};

module.exports = consumer;
