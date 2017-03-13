var app = require('../../server/server');

module.exports = function(Cache) {
  Cache.set = function(map, key, value, cb) {
    var connector = app.dataSources.db.connector;
    connector.set(map, key, value, {}, function(err) {
      if(err) return cb(err);
      cb(null, 'success');
    });
  }

  Cache.remoteMethod('set', {
    accepts: [{
      arg: 'map',
      type: 'string',
      http: {source: 'path'}},
      {
      arg: 'key',
      type: 'string',
      http: {source: 'path'}},
      {
      arg: 'value',
      type: 'object',
      http: {source: 'body'}}],
    returns: [{
      arg: 'status',
      type: 'string'}],
    http: {
      verb: 'POST',
      path: '/grid/:map/:key'},
    });

  Cache.get = function(map, key, cb) {
    var connector = app.dataSources.db.connector;
    connector.get(map, key, {}, function(err, value) {
      if(err) return cb(err);
      cb(null, value);
    });
  }

  Cache.remoteMethod('get', {
    accepts: [{
      arg: 'map',
      type: 'string',
      http: {source: 'path'}},
      {
      arg: 'key',
      type: 'string',
      http: {source: 'path'}}],
    returns: [{
      arg: 'value',
      type: 'object',
      root: true,
      http: {source: 'body'}
     }],
    http: {
      verb: 'GET',
      path: '/grid/:map/:key'},
    });
}
