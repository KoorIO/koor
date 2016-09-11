var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Project = new Schema({
    name: {
        type: String,
        require: true
    },
    domain: {
        type: String,
        index: true,
        require: true,
        unique: true
    },
    api: {
        type: String,
        index: true,
        require: true,
        unique: true
    },
    socket: {
        type: String,
        index: true,
        require: true,
        unique: true
    },
    iot: {
        type: String,
        index: true,
        require: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true
    }
});

Project.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Project', Project);
