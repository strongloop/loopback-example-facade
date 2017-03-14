const app = require('../server/server');
const Promise = require('bluebird');

let customerService, accountService, transactionService, cache;

app.on('started', function(){
  customerService = app.dataSources.Customer;
  accountService = app.dataSources.Account;
  transactionService = app.dataSources.Transaction;
  cache = app.dataSources.Cache;
  customerService.getFunction = getFunction;
  accountService.getFunction = getFunction;
  transactionService.getFunction = getFunction;
  cache.getFunction = getFunction;
});

module.exports.findTransaction = function (input) {
  let find = transactionService.getFunction('Transaction', 'queryByAccount');
  return query({map: 'Transaction', key: input.accountNumber}, find, input);
}

module.exports.findAccountSummary = function (input) {
  let find = accountService.getFunction('AccountSummary', 'findById');
  return query({map: 'AccountSummary', key: input.accountNumber}, find, input);
}

module.exports.findAccount = function (input) {
  let find = accountService.getFunction('Account', 'findById');
  return query({map: 'Account', key: input.accountNumber}, find, input);
}

module.exports.findCustomer = function (input) {
  let find = customerService.getFunction('Customer', 'findById');
  return query({map: 'Customer', key: input.accountNumber}, find, input);
}

function getFunction(model, method) {
  let functionName = model + '_' + method;
  return Promise.promisify(this.createModel(model, {})[functionName]);
}

function query(input, fn, fnInput) {
  var getCache = cache.getFunction('Cache', 'get');
  return getCache(input)
  .then(function(data) {
    if (data && data.obj) {
      console.log(">>>>>>>>>>>>>>>>>Retreived data from cache");
      return data.obj;
    }
  })
  .then(function(data) {
    return fn(fnInput).then(function(data) {
    console.log(">>>>>>>>>>>>>>>>>Retreived data from Microservice");
    return data.obj;
  })});
}

function persistCache (input, cb) {
  var persistCache = cache.getFunction('Cache', 'set');
  persistCache(input, cb);
}
