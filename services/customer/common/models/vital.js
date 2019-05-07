// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

const app = require('../../server/server');
const Promise = require('bluebird');

module.exports = function(Vital) {
  Vital.check = async function() {
    const status = {
      status: 'healthy',
      dependencies: {},
    }
    const dsList = app.dataSources;
    const dsNames = Object.keys(dsList);
    dsNames.forEach(function(dsName) {
      status.dependencies[dsName] = checkVital(dsList[dsName]);
    });
    status.dependencies = await Promise.props(status.dependencies);
    return status;
  };
  function checkVital(ds) {
    return new Promise(function(resolve, reject) {
      ds.ping(function(err, result) {
        if (err) return reject({status: 'unhealthy'});
        resolve({status: 'healthy'});
      });
    });
  }
};
