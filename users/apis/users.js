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
    req.body.isActive = false;
    var user = new db.User(req.body);
    user.save(function(error, newUser){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        db.Token.saveActiveToken(newUser).then(function(to){
            // remove security attributes
            newUser = newUser.toObject();
            if (newUser) {
                delete newUser.hashed_password;
                delete newUser.salt;
            }
            // send email welcome to user
            logger.debug('Send to email %s a token %s', newUser.email, to.token)
            q.create(os.hostname() + 'email', {
                title: '[Koor.Io] Activation Email',
                to: newUser.email,
                emailContent: {
                    username: newUser.firstname,
                    url: config.get('client.url') + '#/activate/' + to.token
                },
                template: 'activate'
            }).priority('high').save();
            res.send(JSON.stringify(newUser));
        });
    });
});

// activate user
router.post('/activate', function(req, res){
    var t = req.body.token;
    var today = moment.utc();
    logger.debug('Verify Activate Token', t);
    db.Token.findOne({ 
        token: t,
        expired_at: {'$gte': today.format(config.get('time_format')).toString()}
    }).then(function(token) {
        db.User.findOne({
            username: token.username
        }).then(function(user) {
            user.isActive = true;
            user.save()
            // send email thankyou to user
            q.create(os.hostname() + 'email', {
                title: '[Koor.Io] Thank You',
                to: token.email,
                emailContent: {
                    username: user.firstname
                },
                template: 'welcome'
            }).priority('high').save();
            user = user.toObject();
            delete user['hashed_password'];
            delete user['salt'];
            res.send(JSON.stringify(user));
        });
    }).catch(function(e){
        return res.status(401).send(JSON.stringify({}));
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
                    // if user is not exists
                    if (!user) {
                        var data = {
                            email: emails[0],
                            username: emails[0],
                            isActive: true
                        };
                        var user = new db.User(data);
                        // create new user
                        user.save(function(error, newUser){
                            if (error) {
                                return res.status(406).send(JSON.stringify({error}));
                            } else {
                                console.log('aaaa', error);
                                console.log('b', newUser);
                                db.Token.saveToken(newUser).then(function(to) {
                                    return res.send(JSON.stringify(to));
                                });
                                // send email thankyou to user
                                q.create(os.hostname() + 'email', {
                                    title: '[Koor.Io] Thank You',
                                    to: newUser.email,
                                    emailContent: {
                                        username: newUser.email
                                    },
                                    template: 'welcome'
                                }).priority('high').save();
                            }
                        });
                    } else {
                        db.Token.saveToken(user).then(function(to) {
                            return res.send(JSON.stringify(to));
                        });
                    }
                }).catch(function(e){
                    res.status(500).send(JSON.stringify({}));
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

    db.User.findOne({
        username: username,
        isActive: true
    }).then(function(user){
        if (!user.authenticate(password)) {
            throw false;
        } else {
            db.Token.saveToken(user).then(function(to) {
                return res.send(JSON.stringify(to));
            });
        }
    }).catch(function(e){
        res.status(401).send(JSON.stringify(e));
    });
});

module.exports = router;
