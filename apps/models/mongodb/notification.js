var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
    type: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'unread'
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Notification', Notification);
