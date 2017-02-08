var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Post = new Schema({
  postType: {
    type: String,
    index: true,
    require: true
  },
  content: {
    type: String
  },
  fileId: {
    type: Schema.Types.ObjectId
  },
  albumId: {
    type: Schema.Types.ObjectId
  },
  userId: {
    type: Schema.Types.ObjectId,
    index: true
  }
});

Post.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Post', Post);
