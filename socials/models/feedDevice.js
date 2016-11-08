var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');

var FeedDevice = new Schema({
    type: {
        type: String,
        require: true
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    deviceId: {
        type: Schema.Types.ObjectId,
        index: true
    }
});

FeedDevice.plugin(CreateUpdatedAt);

module.exports = mongoose.model('FeedDevice', FeedDevice);
