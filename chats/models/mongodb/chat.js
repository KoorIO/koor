var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chat = new Schema({
    message: {
        type: String
    },
    groupId: {
        type: String,
        index: true
    },
    objectId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    objectType: {
        type: String,
        index: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Chat', Chat);
