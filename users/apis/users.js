'use strict';
var express = require('express'), 
    db = require('../models'),
    q = require('../queues'),
    cache = require('../helpers/cache'),
    logger = require('../helpers/logger'),
    moment = require('moment'),
    request = require('request'),
    config = require('config'),
    crypto = require('crypto'),
    os = require('os'),
    router = express.Router();

// create a new user
router.post('/create', function(req, res){
    var user = new db.User(req.body);
    user.save(function(error, new_user){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        // remove security attributes
        new_user = new_user.toObject();
        if (new_user) {
            delete new_user.hashed_password;
            delete new_user.salt;
        }
        // send email welcome to user
        q.create(os.hostname() + 'email', {
            title: '[Site Admin] Thank You',
            to: new_user.email,
            emailContent: {
                username: new_user.username
            },
            template: 'welcome'
        }).priority('high').save();
        res.send(JSON.stringify(new_user));
    });
});

// new user via github
router.post('/github', function(req, res){
    req.body.client_secret = config.get('github.client_secret');
    var request_url = 'https://github.com/login/oauth/access_token';
    request.post({url: request_url, form: req.body, json: true}, function(err, httpResponse, body){ 
        if (err) {
            res.status(401).send(JSON.stringify(err));
        } else {
            request_url = 'https://api.github.com/user/emails';
            request.get({
                url: request_url,
                qs: { access_token: body.access_token },
                json: true,
                headers: { 'User-Agent': '' }
            }, function(err, httpResponse, getEmailBody){ 
                var emails = [];
                getEmailBody.forEach(function(value) {
                    emails.push(value.email);
                });
                db.User.findOne()
                .where('email').in(emails)
                .then(function(user){
                    db.Token.saveToken(user).then(function(to) {
                        return res.send(JSON.stringify(to));
                    });
                }).catch(function(e){
                    // if user is not exists
                    var data = {
                        email: emails[0]
                    };
                    var user = new db.User(data);
                    // create new user
                    user.save(function(error, new_user){
                        if (error) {
                            return res.status(406).send(JSON.stringify({error}));
                        } else {
                            db.Token.saveToken(new_user).then(function(to) {
                                return res.send(JSON.stringify(to));
                            });
                        }
                    });
                });
            });
        }
    });
});

// get a user by id
router.get('/get/:id', function(req, res){
    logger.debug('Get User By Id', req.params.id);
    db.User.findOne({
        _id: req.params.id
    }).then(function(user){
        // remove security attributes
        user = user.toObject();
        if (user) {
            delete user.hashed_password;
            delete user.salt;
        }
        res.send(JSON.stringify(user));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// update a user by id
router.put('/update/:id', function(req, res){
    logger.debug('Update User By Id', req.params.id);
    db.User.findOne({
        _id: req.params.id
    }).then(function(user){
        // remove security attributes
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.save(function(u) {
            res.send(JSON.stringify(u));
        });
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of users
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.User.count({}, function(err, c) {
        db.User
        .find()
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(users) {
            if (err) {
                throw true;
            }
            var ret = {
                count: c,
                rows: users
            };
            res.send(JSON.stringify(ret));
        }).catch(function(e) {
            res.status(500).send(JSON.stringify(e));
        });
    });
});

// login
router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    var generateToken = function (user) {
        crypto.randomBytes(64, function(ex, buf) {
            var token = buf.toString('base64');
            var today = moment.utc();
            var tomorrow = moment(today).add(config.get('token_expire'), 'seconds').format(config.get('time_format'));
            var token = new db.Token({
                userId: user._id,
                token: token,
                expired_at: tomorrow.toString()
            });
            token.save(function(error, to){
                var delta = config.get('token_expire');
                logger.debug('Set User %s to Cache - Exprited after %s seconds', user._id, delta);
                cache.set(to.token, JSON.stringify(user));
                cache.expire(to.token, delta);
                to = to.toObject();
                to['userId'] = user._id;
                return res.send(JSON.stringify(to));
            });

        });
    };

    db.User.findOne({
        username: username
    }).then(function(user){
        if (!user.authenticate(password)) {
            throw false;
        }
        db.Token.findOne({
            username: username
        }).then(function(t){
            if (t) {
                t.remove(function() {
                    return generateToken(user);
                });
            } else {
                return generateToken(user);
            }
        });
    }).catch(function(e){
        res.status(401).send(JSON.stringify(e));
    });
});

module.exports = router;
