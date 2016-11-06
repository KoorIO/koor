var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var File = new Schema({
    name: {
        type: String,
        require: true
    },
    filePath: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    albumId: {
        type: Schema.Types.ObjectId,
        index: true
    }
});

File.plugin(CreateUpdatedAt);

module.exports = mongoose.model('File', File);
