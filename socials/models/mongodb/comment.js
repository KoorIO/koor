var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Comment = new Schema({
  objectId: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  },
  objectType: {
    type: String,
    index: true,
    require: true
  },
  message: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    index: true
  }
});

Comment.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Comment', Comment);
