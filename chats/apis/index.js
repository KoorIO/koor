'use strict';
var express = require('express'), 
    router = express.Router();

router.use('/api/v1/chats', require('./chats'));
module.exports = router;
