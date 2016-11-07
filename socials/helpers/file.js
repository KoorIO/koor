var config = require('config');
var path = require('path');

function filePathToUrls(filePath) {
    var ret = {};
    var thumbnails = config.get('thumbnails');
    var ext = path.extname(filePath);
    var file = path.basename(filePath, ext);
    for (var k in thumbnails) {
        ret['t' + thumbnails[k][0] + 'x' + thumbnails[k][1]] = config.get('server.fileUrl') + 
            fileNameToThumbnail(file, ext, thumbnails[k][0], thumbnails[k][1]);
    }
    return ret;
}

function fileNameToThumbnail(file, ext, x, y) {
    return file + '-thumbnail-' + x + 'x' + y + ext;
}

module.exports = {
    filePathToUrls: filePathToUrls(),
    fileNameToThumbnail: fileNameToThumbnail()
};
