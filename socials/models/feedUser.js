var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');

var FeedUser = new Schema({
    type: {
        type: String,
        require: true
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    }
});

FeedUser.plugin(CreateUpdatedAt);

module.exports = mongoose.model('FeedUser', FeedUser);
