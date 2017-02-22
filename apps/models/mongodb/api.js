var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Api = new Schema({
  name: {
    type: String
  },
  path: {
    type: String,
    index: true,
    require: true
  },
  method: {
    type: String,
    index: true,
    require: true
  },
  tags: {
    type: Array
  },
  description: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  },
  response: {
    type: Schema.Types.Mixed,
    require: true
  },
  request: {
    type: Schema.Types.Mixed
  }
}, {timestamps: true});

module.exports = mongoose.model('Api', Api);
