'use strict';
var consumer = {};
var logger = require('../helpers/logger');
var path = require('path');
var easyimg = require('easyimage');

consumer.name = 'generateThumbnails';

consumer.task = function(job, done){
    var data = job.data;
    var extension = path.extname(data.path);
    var file = path.basename(data.path,extension);
    var resize = function(x,y) {
        easyimg.resize({
            src: path.join(data.path), dst: path.join(__dirname ,'/../uploads/', 
                                           file + '-thumbnail-' + x + 'x' + y + extension),
            width: x,
            height: y
        }).then(function(image) {
                logger.info('Resized and cropped: ' + image.width + ' x ' + image.height);
            }, function (err) {
                logger.error(err);
            }
        );
    };

    // 100
    resize(100, 100);
    // 200
    resize(200, 200);
    // 300
    resize(300, 300);
    // 400
    resize(400, 400);
    // 500
    resize(500, 500);
    // 600
    resize(600, 600);

    done();
};

module.exports = consumer;
