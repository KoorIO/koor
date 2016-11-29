var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Feel = new Schema({
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
    feelType: {
        type: String,
        index: true,
        require: true,
        default: 'LIKE'
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    }
});

Feel.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Feel', Feel);
