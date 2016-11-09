'use strict';
var express = require('express'), 
    db = require('../models/mongodb'),
    q = require('../queues'),
    services = require('../services'),
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
    var user = new db.User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });
    logger.debug('Register new user %s', req.body.email);
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
                title: '[Koor.IO] Activation Email',
                to: newUser.email,
                emailContent: {
                    username: newUser.firstname,
                    url: config.get('client.url') + '#/activate/' + to.token
                },
                template: 'activate'
            }).priority('high').save();
            q.create(os.hostname() + 'esUsers', {
                userId: newUser._id,
                accessToken: to.token
            }).priority('high').save();
            res.send(JSON.stringify(newUser));
        });
    });
});

// forgot password
router.post('/forgotpassword', function(req, res){
    logger.debug('Forgot Password Email', req.body.email);
    db.User.findOne({
        email: req.body.email
    }).then(function(user){
        if (!user) {
            throw {};
        }
        db.Token.saveActiveToken(user).then(function(to){
            // send email forgot password to user
            logger.debug('Send to email %s a token %s', user.email, to.token)
            q.create(os.hostname() + 'email', {
                title: '[Koor.IO] Forgot Password Email',
                to: user.email,
                emailContent: {
                    username: user.firstname || user.email,
                    url: config.get('client.url') + '#/resetpassword/' + to.token
                },
                template: 'forgotpassword'
            }).priority('high').save();
            res.json({});
        });
    }).catch(function(e){
        res.status(406).json(e);
    });
});

// Reset Password
router.post('/resetpassword', function(req, res){
    var t = req.body.token;
    var today = moment.utc();
    logger.debug('Verify to Reset Password', t);
    db.Token.findOne({ 
        token: t,
        expired_at: {'$gte': today.format(config.get('time_format')).toString()}
    }).then(function(token) {
        db.User.findOne({
            username: token.username
        }).then(function(user) {
            user.password = req.body.password;
            user.save(function (e) {
                if (e) {
                    return res.status(406).json(e);
                } else {
                    user = user.toObject();
                    delete user['hashed_password'];
                    delete user['salt'];
                    res.send(JSON.stringify(user));
                }
            });
        });
    }).catch(function(e){
        return res.status(406).json(e);
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
                title: '[Koor.IO] Thank You',
                to: user.email,
                emailContent: {
                    username: user.firstname
                },
                template: 'welcome'
            }).priority('high').save();
            user = user.toObject();
            delete user['hashed_password'];
            delete user['salt'];
            q.create(os.hostname() + 'esUsers', {
                userId: newUser._id,
                accessToken: t
            }).priority('high').save();
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
    logger.info('Login via Github ...');
    request.post({url: request_url, form: req.body, json: true}, function(err, httpResponse, body){ 
        if (err) {
            logger.error('Failed - Get Github Access Token', httpResponse);
            return res.status(401).send(JSON.stringify(err));
        } else {
            logger.info('Get Github Access Token', body.access_token);
            request_url = 'https://api.github.com/user/emails';
            request.get({
                url: request_url,
                qs: { access_token: body.access_token },
                json: true,
                headers: { 'User-Agent': '' }
            }, function(err, httpResponse, getEmailBody){ 
                if (err) {
                    logger.error('Failed - Get Emails from Github', httpResponse);
                    return res.status(401).send(JSON.stringify(err));
                }
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
                                db.Token.saveToken(newUser).then(function(to) {
                                    to.email = newUser.email;
                                    to.userId = newUser._id;
                                    q.create(os.hostname() + 'esUsers', {
                                        userId: newUser._id,
                                        accessToken: to.token
                                    }).priority('high').save();
                                    // send email thankyou to user
                                    q.create(os.hostname() + 'email', {
                                        title: '[Koor.IO] Thank You',
                                        to: newUser.email,
                                        emailContent: {
                                            username: newUser.email
                                        },
                                        template: 'welcome'
                                    }).priority('high').save();
                                    return res.send(JSON.stringify(to));
                                });
                            }
                        });
                    } else {
                        db.Token.saveToken(user).then(function(to) {
                            to.email = user.email;
                            to.userId = user._id;
                            q.create(os.hostname() + 'esUsers', {
                                userId: user._id,
                                accessToken: to.token
                            }).priority('high').save();
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
router.get(['/get', '/get/:id'], function(req, res){
    var userId = req.params.id || req.body.userId;
    logger.debug('Get User By Id', userId);
    db.User.findOne({
        _id: userId
    }).then(function(user){
        // remove security attributes
        user = user.toObject();
        if (user) {
            delete user.hashed_password;
            delete user.salt;
        }
        if (user.fileId) {
            services.File.getFileById({
                fileId: user.fileId,
                accessToken: req.body.accessToken
            }).then(function(body) {
                user.file = body;
                res.json(user);
            });
        } else {
            res.json(user);
        }
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// update a user by id
router.put(['/update/:id', '/update'], function(req, res){
    var userId = req.params.id || req.body.userId;
    if (userId !== req.body.userId) {
        res.status(406).json();
    }
    logger.debug('Update User By Id', userId);
    db.User.findOne({
        _id: userId
    }).then(function(user){
        user.username = req.body.username || user.username;
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        user.fileId = req.body.fileId || user.fileId;
        user.save(function(e) {
            if (e) {
                res.status(406).json(e);
            } else {
                q.create(os.hostname() + 'esUsers', {
                    userId: user._id,
                    accessToken: req.body.accessToken
                }).priority('high').save();
                res.send(JSON.stringify({}));
            }
        });
    }).catch(function(e){
        res.status(406).send(JSON.stringify(e));
    });
});

// get list of users
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('User List', limit, skip);
    db.User.count({}, function(err, c) {
        db.User
        .find()
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(users) {
            if (err) {
                throw {};
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
    logger.debug('User %s loggin', req.body.username);

    db.User.findOne({
        username: username,
        isActive: true
    }).then(function(user){
        if (!user.authenticate(password)) {
            throw {};
        } else {
            db.Token.saveToken(user).then(function(to) {
                to.email = user.email;
                to.userId = user._id;
                return res.send(JSON.stringify(to));
            });
        }
    }).catch(function(e){
        res.status(401).send(JSON.stringify(e));
    });
});

module.exports = router;
