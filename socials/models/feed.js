var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');

var Feed = new Schema({
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

Feed.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Feed', Feed);
