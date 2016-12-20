'use strict';
var express = require('express'),
    logger = require('../helpers/logger'),
    es = require('../models/elasticsearch'),
    nj = require('../models/neo4j'),
    router = express.Router();

// People You May Know
router.get('/peopleYouMayKnow/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Get People May You Know', req.body.userId, limit, skip);
    nj.User.peopleYouMayKnow({
        userId: req.body.userId,
        limit: limit,
        skip: skip
    }).then(function(userIds) {
        if (userIds.length > 0) {
            es.User.searchByUserIds({
                userIds: userIds,
                from: skip,
                size: limit
            }).then(function(response) {
                for (var i in response['hits']) {
                    nj.User.countMutualFriends({
                        aId: req.body.userId,
                        bId: response['hits'][i]._id
                    }).then(function(result) {
                        if (result.records.length > 0) {
                            response['hits'][i]._source.mutualFriends = parseInt(result.records[0]._fields);
                        }
                        return res.json(response);
                    });
                }
            }).catch(function() {
                return res.json({});
            });
        } else {
            return res.json({});
        }
    }).catch(function(e) {
        logger.error(e);
    });
});

module.exports = router;
