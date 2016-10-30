var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var DeviceLog = new Schema({
    type: {
        type: String,
        require: true
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    deviceId: {
        type: Schema.Types.ObjectId,
        index: true,
        index: true
    }
});

DeviceLog.plugin(CreateUpdatedAt);

module.exports = mongoose.model('DeviceLog', DeviceLog);
