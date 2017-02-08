'use strict';
var express = require('express'),
  db = require('../models/mongodb'),
  logger = require('../helpers/logger'),
  router = express.Router();

// get list of device logs
router.get('/list/:deviceId/:page/:limit', function(req, res) {
  var limit = (req.params.limit)? parseInt(req.params.limit): 10;
  var skip = (req.params.page)? limit * (req.params.page - 1): 0;
  logger.info('Get Device Logs', req.params.deviceId);
  db.DeviceLog.count({ deviceId: req.params.deviceId }, function(err, c) {
    db.DeviceLog
        .find({
          deviceId: req.params.deviceId
        })
        .skip(skip)
        .limit(limit)
        .sort({'_id': 'desc'})
        .then(function(apis) {
          if (err) {
            throw true;
          }
          var ret = {
            count: c,
            rows: apis
          };
          res.json(ret);
        }).catch(function(e) {
          res.status(400).send(JSON.stringify(e));
        });
  });
});

module.exports = router;
