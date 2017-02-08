var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    index: true
  }
}, {timestamps: true});

module.exports = mongoose.model('DeviceLog', DeviceLog);
