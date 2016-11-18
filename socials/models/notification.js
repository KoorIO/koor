var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var q = require('q');

var Notification = new Schema({
    type: {
        type: String,
        require: true,
        index: true
    },
    id: {
        type: String,
        index: true
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
});

Notification.index({type: 1, id: 1}, {unique: true});

Notification.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Notification', Notification);
