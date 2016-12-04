var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupChat = new Schema({
    groupId: {
        type: String,
        index: true
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    objectId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    objectType: {
        type: String,
        index: true
    },
    status: {
        type: String,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('GroupChat', GroupChat);
