var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');

var Feed = new Schema({
    type: {
        type: String,
        require: true,
        index: true
    },
    objectType: {
        type: String,
        require: true,
        index: true
    },
    objectId: {
        type: String,
        index: true
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    score: {
        type: String,
        require: true
    }
});

Feed.index({objectType: 1, objectId : 1, type: 1}, {unique: true});

Feed.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Feed', Feed);
