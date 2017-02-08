var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Storage = new Schema({
  data: {
    type: String
  },
  fieldId: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  }
});

Storage.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Storage', Storage);
