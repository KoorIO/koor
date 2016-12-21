var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Activity = new Schema({
    type: {
        type: String,
        require: true
    },
    data: {
        type: Schema.Types.Mixed,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        index: true
    }
});

Activity.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Activity', Activity);
