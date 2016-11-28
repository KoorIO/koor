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
    userIds: [{
        type: Schema.Types.ObjectId,
        index: true
    }]
});

GroupChat.plugin(CreateUpdatedAt);

module.exports = mongoose.model('GroupChat', GroupChat);
