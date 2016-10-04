'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models');
var cache = require('../helpers/cache');
consumer.name = os.hostname() + 'store_data';

consumer.task = function(job, done){
    var data = job.data;
    db.Field.find({
        projectId: data.projectId
    }).then(function(fields) {
        fields.forEach(function(f) {
            if (f.code in data.query || f.code in data.body || f.code in data.payload) {
                var value = data.query[f.code] || data.body[f.code] || data.payload[f.code];
                var storage = db.Storage({
                    fieldId: f._id,
                    data: value
                });
                storage.save(function(error, s) {
                    if (error) {
                        throw true;
                    } else {
                        cache.publish('field_data', JSON.stringify({
                            value: value,
                            domain: data.domain,
                            fieldId: f._id
                        }));
                        logger.debug('Saved data %s id %s code %s successfully', value, f._id, f.code);
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
