'use strict';

var Promise = require('bluebird');
var services = require('../../lib/health-check');

module.exports = function(Vitals) {
  Vitals.get = function() {
    var serviceList = services.checkHealth();
    return Promise.all(serviceList);
  }
  Vitals.remoteMethod('get', {
      returns: [{
        arg: 'response',
        type: 'object',
        http: {source: 'res'},
        root: true}],
      http: {
        verb: 'GET',
        path: '/',
      },
    });
};
