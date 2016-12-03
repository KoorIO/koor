var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Chat = new Schema({
    message: {
        type: String
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'GroupChat'
    },
    objectId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    objectType: {
        type: String,
        index: true
    }
});

Chat.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Chat', Chat);
