var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Album = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    }
});

Album.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Album', Album);
