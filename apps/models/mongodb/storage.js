var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Storage = new Schema({
  data: {
    type: String
  },
  fieldId: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Storage', Storage);
