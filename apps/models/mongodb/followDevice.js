var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var FollowDevice = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true
  },
  deviceId: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true
  }
});

FollowDevice.index({userId: 1, deviceId: 1}, {unique: true});

FollowDevice.plugin(CreateUpdatedAt);
module.exports = mongoose.model('FollowDevice', FollowDevice);
