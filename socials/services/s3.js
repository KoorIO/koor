'use strict';
var path = require('path');
const config = require('config');
const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime-types');
const logger = require('../helpers/logger');

AWS.config.update({
  accessKeyId: config.get('aws.key'),
  secretAccessKey: config.get('aws.secret')
});

const s3 = new AWS.S3();

const S3Bucket = config.get('aws.s3.bucket');

function upload(data) {
  const p = new Promise(function(resolve, reject) {
    const file = path.basename(data.fileName);
    const fileStream = fs.createReadStream(data.fileName);
    const key = path.join(data.userId, file);
    logger.debug('Upload to s3', key);
    const params = {
      Bucket: S3Bucket,
      Key: key,
      Body: fileStream,
      ACL: 'public-read',
      ContentType: mime.contentType(path.extname(data.fileName))
    };
    fileStream.on('error', function (err) {
      reject(err);
    });
    fileStream.on('open', function () {
      s3.upload(params, function (err) {
        if (err) {
          reject(err);
        }
        resolve(key);
      });
    });
  });
  return p;
}


module.exports = {
  upload
};
