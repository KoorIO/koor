'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models');
consumer.name = os.hostname() + 'store_data';

consumer.task = function(job, done){
    var data = job.data;
    db.Field.find({
        projectId: data.projectId
    }).then(function(fields) {
        fields.forEach(function(f) {
            if (f.code in data.query || f.conde in data.body) {
                var storage = db.Storage({
                    fieldId: f._id,
                    data: data.query[f.code] || data.body[f.code]
                });
                storage.save(function(error, s) {
                    if (error) {
                        throw true;
                    } else {
                        logger.debug('Saved data %s successfully', f._id, f.code);
                    }
                });
            }
        });
    }).catch(function(e){
        logger.error('Failed - Processing to store data');
    });
    done();
};

module.exports = consumer;
