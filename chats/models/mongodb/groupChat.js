var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var GroupChat = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    fileId: {
        type: Schema.Types.ObjectId
    },
    albumId: {
        type: Schema.Types.ObjectId
    }
});

GroupChat.plugin(CreateUpdatedAt);

module.exports = mongoose.model('GroupChat', GroupChat);
