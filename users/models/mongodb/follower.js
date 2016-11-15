var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

// Define Follower Schema
var Follower = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        index: true,
        required: true
    },
    followerId: {
        type: Schema.Types.ObjectId,
        index: true,
        required: true
    }
});

Follower.index({userId: 1, followerId: 1}, {unique: true});

Follower.plugin(CreateUpdatedAt);
module.exports = mongoose.model('Follower', Follower);
