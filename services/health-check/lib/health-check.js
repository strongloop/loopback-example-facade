'use strict';

var Promise = require('bluebird');
var config = require('../endpoints.json');
var net = require('net');

module.exports.checkHealth = function () {
  var list= config.endpoints;
  if(list && list.length) {
    var promises = [];
    list.forEach(function(item) {
      promises.push(execute(item.host, item.port));
    });
    return promises;
  }
}

function execute(host, port) {
  return new Promise(function(resolve, reject) {
    var socket = net.createConnection(port, host);
    socket.on('connect', function () {
      resolve('connection to ' + host + ' service is success');
      socket.end();
    });
    socket.on('error', function (err) {
      reject('Error connecting to ' + host + ':' + port + ' ' + err);
    });
  });
}
