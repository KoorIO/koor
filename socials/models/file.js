var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var File = new Schema({
    description: {
        type: String
    },
    filePath: {
        type: String,
        require: true
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
