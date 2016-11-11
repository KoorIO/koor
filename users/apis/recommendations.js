'use strict';
var express = require('express'), 
    logger = require('../helpers/logger'),
    driver = require('../helpers/neo4j'),
    router = express.Router();

// People May You Know
router.get('/peopleMayYouKnow/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    logger.debug('Get People May You Know', limit, skip);
    var session = driver.session();
    session
    .run('MATCH (u:Users {userId: "' + req.body.userId + '"}) \
         MATCH (u)-[:FOLLOW]->()-[:FOLLOW]->(p) RETURN p')
    .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record);
        });
        // Completed!
        session.close();
    });
});

module.exports = router;
