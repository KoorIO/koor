'use strict';
var q = require('q'),
  config = require('config'),
  es = require('../../helpers/es');

var search = function(data) {
  var deferred = q.defer();
  var query = {
    index: config.get('es.index'),
    type: 'users',
    body:{
      from: data.form,
      size: data.size,
      query: { bool: {}}
    }
  };
  if (data.query) {
    query.body.query.bool = {
      should: [
        {
          'multi_match': {
            query: data.query ,
            type: 'cross_fields',
            operator: 'or',
            fields: [ 'firstname', 'lastname' ]
          }
        },
        {
          match: {
            email: {
              query: data.query,
              type: 'phrase_prefix'
            }
          }
        }
      ]
    };
  }
  es.search(query, function (error, response) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(response.hits);
    }
  });
  return deferred.promise;
};

var searchByUserIds = function(data) {
  var deferred = q.defer();
  es.search({
    index: config.get('es.index'),
    type: 'users',
    body:{
      from: data.form,
      size: data.size,
      query: {
        'constant_score': {
          filter: [
            {
              terms: {
                _id: data.userIds
              }
            }
          ]
        }
      }
    }
  }, function (error, response) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(response.hits);
    }
  });
  return deferred.promise;
};


module.exports = {
  searchName: 'User',
  search: search,
  searchByUserIds: searchByUserIds
};
