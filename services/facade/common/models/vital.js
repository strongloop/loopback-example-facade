const app = require('../../server/server');
const Promise = require('bluebird');

module.exports = function(Vital) {
  Vital.check = async function() {
    const status = {
      status: 'healthy',
      dependencies: {},
    }
    const modelList = app.models;
    const modelNames = Object.keys(modelList);
    modelNames.forEach(function(modelName) {
      status.dependencies[modelName] = checkVital(modelList[modelName]);
    });
    status.dependencies = await Promise.props(status.dependencies);
    return status;
  };
  function checkVital(model) {
    if(model.Vital_check) {
      console.log(model.Vital_check);
      return new Promise(function(resolve, reject) {
        model.Vital_check(function(result) {
          if (result.status !== 200) return resolve({status: 'unhealthy'});
          resolve(result.obj);
        });
      });
    }
  }
};
