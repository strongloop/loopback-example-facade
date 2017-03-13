const app = require('../server/server');

let customerService, accountService, transactionService;

app.on('started', function(){
  customerService = app.dataSources.Customer;
  accountService = app.dataSources.Account;
  transactionService = app.dataSources.Transaction;
  customerService.getFunction = getFunction;
  accountService.getFunction = getFunction;
  transactionService.getFunction = getFunction;
});

function getFunction(model, method) {
  let functionName = model + '_' + method;
  return this.createModel(model, {})[functionName];
}

module.exports.findTransaction = function (input) {
  let find = transactionService.getFunction('Transaction', 'queryByAccount');
  return new Promise(function (resolve, reject) {
    find(input, function(err, data) {
    if (err) return reject(new Error(err));
    resolve(data);
    });
  });
}

module.exports.findAccountSummary = function (input) {
  let find = accountService.getFunction('AccountSummary', 'findById');
  return new Promise(function (resolve, reject) {
    find(input, function(err, data) {
    if (err) return reject(new Error(err));
    resolve(data);
    });
  });
}

module.exports.findAccount = function (input) {
  let find = accountService.getFunction('Account', 'findById');
  return new Promise(function (resolve, reject) {
    find(input, function(err, data) {
    if (err) return reject(new Error(err));
    resolve(data);
    });
  });
}

module.exports.findCustomer = function (input) {
  let find = customerService.getFunction('Customer', 'findById');
  return new Promise(function (resolve, reject) {
    find(input, function(err, data) {
    if (err) return reject(new Error(err));
    resolve(data);
    });
  });
}
