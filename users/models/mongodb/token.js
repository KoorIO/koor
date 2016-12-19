var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var logger = require('../../helpers/logger');
var crypto = require('crypto');
var moment = require('moment');
var config = require('config');
var cache = require('../../helpers/cache');
var q = require('q');


var Token = new Schema({
    username: {
        type: String,
        index: true,
        required: true
    },
    token: {
        type: String,
        index: true,
        required: true
    },
    expired_at: {
        type: String,
        index: true,
        required: true
    }
});

Token.plugin(CreateUpdatedAt);

Token.statics = {
    saveActiveToken: function (user) {
        var deferred = q.defer();
        var _this = this;
        var today = moment.utc();
        crypto.randomBytes(20, function(ex, buf) {
            var t = buf.toString('hex');
            var tomorrow = moment(today).add(24*60*60, 'seconds').format(config.get('time_format'));
            (new _this({
                username: user.username,
                userId: user._id,
                token: t,
                expired_at: tomorrow.toString()
            })).save(function(error, to){
                deferred.resolve(to);
            }).catch(function(e) {
                deferred.reject(e);
            });
        });
        // remove expire token
        _this.find({
            expired_at: {'$lt': today.format(config.get('time_format')).toString()}
        }).remove().exec();
        return deferred.promise;
    },
    saveToken: function (user) {
        var deferred = q.defer();
        var _this = this;
        var today = moment.utc();

        crypto.randomBytes(64, function(ex, buf) {
            var t = buf.toString('hex');
            var tomorrow = moment(today).add(config.get('token_expire'), 'seconds').format(config.get('time_format'));
            (new _this({
                username: user.username,
                userId: user._id,
                token: t,
                expired_at: tomorrow.toString()
            })).save(function(error, to){
                var delta = config.get('token_expire');
                logger.debug('Set User %s to Cache - Exprited after %s seconds', user._id, delta);
                cache.set(to.token, JSON.stringify(user));
                cache.expire(to.token, delta);
                to = to.toObject();
                to['userId'] = user._id;
                deferred.resolve(to);
            }).catch(function(e) {
                deferred.reject(e);
            });
        });
        // remove expire token
        _this.find({
            expired_at: {'$lt': today.format(config.get('time_format')).toString()}
        }).remove().exec();
        return deferred.promise;
    }
}

module.exports = mongoose.model('Token', Token);
