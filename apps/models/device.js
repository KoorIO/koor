var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');
var crypto = require('crypto');

var Device = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        require: true,
        default: false
    },
    projectId: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true
    }
});

Device.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Device', Device);
