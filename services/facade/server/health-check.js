'use strict';

var Promise = require('bluebird');
var config = require('../endpoints.json');
var http = require('http');

module.exports.checkHealth = function() {
  var list = config.endpoints;
  if (list && list.length) {
    var promises = [];
    list.forEach(function(item) {
      promises.push(execute(item.host, item.port, '/vitals'));
    });
    return promises;
  }
};

function execute(host, port, path) {
  var httpOptions = {
    host: host,
    port: port,
    path: path,
    method: 'GET',
  };
  return new Promise(function(resolve) {
    var req = http.request(httpOptions, function(response) {
      var str = '';
      response.on('data', function(chunk) {
        str += chunk;
      });
      response.on('end', function() {
        resolve({
          path: host,
          health: JSON.parse(str),
        });
      });
    });
    req.on('error', function() {
      resolve({
        status: 'unhealthy',
      });
    });
    req.end();
  });
}
