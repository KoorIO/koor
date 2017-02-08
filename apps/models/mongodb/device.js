var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Device = new Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  address: String,
  location: {
    type: {
      type: String,
      enum: 'Point',
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0,0]
    }
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
}, {timestamps: true});

Device.index({ location : '2dsphere'});

module.exports = mongoose.model('Device', Device);
