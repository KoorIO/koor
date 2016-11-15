'use strict';
var express = require('express'), 
    logger = require('../helpers/logger'),
    driver = require('../helpers/neo4j'),
    es = require('../models/elasticsearch'),
    router = express.Router();

// People May You Know
router.get('/peopleMayYouKnow/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Get People May You Know', req.body.userId, limit, skip);
    var session = driver.session();
    session
    .run('MATCH (u:Users)-[:FOLLOW]->(f:Users)-[:FOLLOW]->(p:Users) \
        WHERE u.userId = {userId} RETURN DISTINCT p \
        SKIP {skip} \
        LIMIT {limit} \
        ', {userId: req.body.userId, limit: limit, skip: skip})
    .then(function(result) {
        var userIds = [];
        result.records.forEach(function(record) {
            userIds.push(record._fields[0].properties.userId);
        });
        // Completed!
        session.close();
        es.User.searchByUserIds({
            userIds: userIds,
            from: skip,
            size: limit
        }).then(function(response) {
            return res.json(response);
        }).catch(function(e) {
            return res.json({});
        });
    }).catch(function(e) {
        logger.error(e);
    });
});

module.exports = router;
