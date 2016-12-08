var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');
var crypto = require('crypto');

var Project = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    domain: {
        type: String,
        index: true
    },
    dnsId: {
        type: String
    },
    dnsStatus: {
        type: Boolean
    },
    secretKey: {
        type: String,
        index: true,
        require: true,
        default: 'GNhDNu6vhDNKB9LDFTkBTMk3SGg2eevg'
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true
    },
    fileId: {
        type: Schema.Types.ObjectId
    },
    albumId: {
        type: Schema.Types.ObjectId
    }
});

Project.plugin(CreateUpdatedAt);
Project.statics = {
    generateSecretKey: function () {
        var deferred = q.defer();
        crypto.randomBytes(32, function(ex, buf) {
            var t = buf.toString('hex');
            if (ex) {
                deferred.reject(ex);
            } else {
                deferred.resolve(t);
            }
        });
        return deferred.promise;
    }
};

module.exports = mongoose.model('Project', Project);
