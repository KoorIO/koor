var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var logger = require('../helpers/logger');
var crypto = require('crypto');
var moment = require('moment');
var config = require('config');
var cache = require('../helpers/cache');
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
    expired_at: String
});

Token.plugin(CreateUpdatedAt);

Token.statics = {
    saveToken: function (user) {
        var deferred = q.defer();
        var _this = this;
        crypto.randomBytes(64, function(ex, buf) {
            var t = buf.toString('hex');
            var today = moment.utc();
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
        return deferred.promise;
    }
}

module.exports = mongoose.model('Token', Token);
