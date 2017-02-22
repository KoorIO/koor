var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Field = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  code: {
    type: String,
    index: true
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
  }
}, {timestamps: true});

module.exports = mongoose.model('Field', Field);
