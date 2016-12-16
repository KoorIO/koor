'use strict';
angular.module('siteSeedApp').factory('Files', function (Upload, $q, APP_CONFIG, $timeout) {
    var uploadData = {};
 
    return {
        uploadData: uploadData,
        upload: function (files) {
            var deferred = $q.defer();
            var url = APP_CONFIG.services.files.upload;
            files.upload = Upload.upload({
                url: url,
                fields: {
                },
                file: files
            }).success(function (data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        },
        uploadFilesOnce: function(files) {
            uploadData.files = files;
            if (files && files.length) {
                Upload.upload({
                    url: APP_CONFIG.services.files.uploadFiles, 
                    data: {
                        files: files
                    }
                }).then(function (response) {
                    $timeout(function () {
                        uploadData.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        uploadData.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    uploadData.progress = 
                        Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        },
        uploadFiles: function(files, errFiles) {
            uploadData.files = files;
            uploadData.errFiles = errFiles;

            angular.forEach(files, function(file) {
                file.upload = Upload.upload({
                    url: APP_CONFIG.services.files.uploadFiles,
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        uploadData.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * 
                        evt.loaded / evt.total));
                });
            });
        }
    };
});
