var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Api = new Schema({
    name: {
        type: String
    },
    path: {
        type: String,
        index: true,
        require: true
    },
    method: {
        type: String,
        index: true,
        require: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true
    },
    response: {
        type: Schema.Types.Mixed,
        require: true
    },
    request: {
        type: Schema.Types.Mixed
    }
});

Api.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Api', Api);
