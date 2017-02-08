'use strict';
var express = require('express'),
  router = express.Router();

router.use('/api/v1/projects', require('./projects'));
router.use('/api/v1/devices', require('./devices'));
router.use('/api/v1/deviceLogs', require('./deviceLogs'));
router.use('/api/v1/mqtt', require('./mqtt'));
router.use('/api/v1/apis', require('./apis'));
router.use('/api/v1/fields', require('./fields'));
router.use('/api/v1/storages', require('./storages'));
router.use('/api/v1/activities', require('./activities'));
router.use('/run', require('./run'));
router.use('/get', require('./get'));
router.use('/docs', require('./docs'));

module.exports = router;
