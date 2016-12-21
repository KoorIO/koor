var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Notification = new Schema({
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

Notification.index({objectType: 1, objectId: 1, type: 1}, {unique: true});

Notification.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Notification', Notification);
