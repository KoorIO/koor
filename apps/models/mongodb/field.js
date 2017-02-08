var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

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
  projectId: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  }
});

Field.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Field', Field);
