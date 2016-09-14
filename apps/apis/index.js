'use strict';
var express = require('express'), 
    router = express.Router();

router.use('/api/v1/projects', require('./projects'));
router.use('/api/v1/mqtt', require('./mqtt'));
router.use('/api/v1/apis', require('./apis'));

module.exports = router;
