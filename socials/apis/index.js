'use strict';
var express = require('express'), 
    router = express.Router();

router.use('/api/v1/notifications', require('./notifications'));

module.exports = router;
