'use strict';
var express = require('express'), 
    router = express.Router();

router.use('/api/v1/notifications', require('./notifications'));
router.use('/api/v1/feeds', require('./feeds'));
router.use('/api/v1/upload', require('./upload'));
router.use('/api/v1/files', require('./files'));
router.use('/files/', require('./sendFiles'));

module.exports = router;
