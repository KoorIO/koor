'use strict';
var consumer = {};
var os = require('os');
var logger = require('../helpers/logger');
var db = require('../models/mongodb');
var cache = require('../helpers/cache');
var ObjectId = require('mongoose').Types.ObjectId;
consumer.name = os.hostname() + 'storeData';

consumer.task = function(job, done) {
    var data = job.data;
    logger.debug('Store data for %s domain %s', data.projectId, data.domain);
    db.Field.find({
        projectId: new ObjectId(data.projectId)
    }).then(function(fields) {
        fields.forEach(function(f) {
            if (f.code in data.query || f.code in data.body || f.code in data.payload) {
                var value = data.query[f.code] || data.body[f.code] || data.payload[f.code];
                var storage = db.Storage({
                    fieldId: f._id,
                    data: value
                });
                storage.save(function(error) {
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
    }).catch(function(e) {
        logger.error('Failed - Processing to store data', e);
    });
    done();
};

module.exports = consumer;
