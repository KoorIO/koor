var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Device = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        require: true,
        default: false
    },
    fileId: {
        type: Schema.Types.ObjectId
    },
    albumId: {
        type: Schema.Types.ObjectId
    },
    projectId: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true
    },
    subscriberId: {
        type: String,
        index: true
    }
});

Device.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Device', Device);
