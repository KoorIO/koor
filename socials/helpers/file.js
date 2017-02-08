var config = require('config');
var path = require('path');

var fileToUrls = function fileToUrls(file) {
  var ret = {};
  var thumbnails = config.get('thumbnails');
  var ext = path.extname(file.fileName);
  var f = path.basename(file.fileName, ext);
  var urljoin = require('url-join');
  for (var k in thumbnails) {
    ret['t' + thumbnails[k][0] + 'x' + thumbnails[k][1]] = urljoin(config.get('server.fileUrl'),
            'files', file.userId, file.albumId,
            fileNameToThumbnail(f, ext, thumbnails[k][0], thumbnails[k][1]));
  }
  ret['default'] = urljoin(config.get('server.fileUrl'), 'files', file.userId, file.albumId,file.fileName);
  return ret;
};

var fileNameToThumbnail = function fileNameToThumbnail(file, ext, x, y) {
  return file + '-thumbnail-' + x + 'x' + y + ext;
};

module.exports = {
  fileToUrls: fileToUrls,
  fileNameToThumbnail: fileNameToThumbnail
};
