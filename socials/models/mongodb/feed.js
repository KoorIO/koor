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
    id: {
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
    }
});

Feed.index({type: 1, id: 1}, {unique: true});

Feed.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Feed', Feed);
