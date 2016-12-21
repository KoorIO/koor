'use strict';
var consumer = {};
var logger = require('../helpers/logger');
var fileHelper = require('../helpers/file');
var path = require('path');
var easyimg = require('easyimage');
var os = require('os');
var config = require('config');

consumer.name = os.hostname() + 'generateThumbnails';

consumer.task = function(job, done) {
    var data = job.data;
    var extension = path.extname(data.path);
    var file = path.basename(data.path, extension);
    var resize = function(x,y) {
        easyimg.resize({
            src: path.join(data.path),
            dst: path.join(path.dirname(data.path), fileHelper.fileNameToThumbnail(file, extension, x, y)),
            width: x,
            height: y
        }).then(function(image) {
            logger.info('Resized and cropped: ' + image.width + ' x ' + image.height);
        }, function (err) {
            logger.error(err);
        }
        );
    };

    var thumbnails = config.get('thumbnails');
    for (var k in thumbnails) {
        resize(thumbnails[k][0], thumbnails[k][1]);
    }
    done();
};

module.exports = consumer;
