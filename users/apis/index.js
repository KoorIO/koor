'use strict';
var express = require('express'),
    router = express.Router();

router.use('/api/v1/users', require('./users'));
router.use('/api/v1/followers', require('./followers'));
router.use('/api/v1/recommendations', require('./recommendations'));
router.use('/api/v1/config', require('./config'));

module.exports = router;
