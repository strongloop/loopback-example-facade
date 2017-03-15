'use strict';

const app = require('../server/server');
const Promise = require('bluebird');
const services = require('../lib/services');

exports.getAggregateAccountSummary = getAggregateAccountSummary;

let customerService, accountService, transactionService;

app.on('started', function() {
  customerService = app.dataSources.Customer;
  accountService = app.dataSources.Account;
  transactionService = app.dataSources.Transaction;
  customerService.getFunction = getFunction;
  accountService.getFunction = getFunction;
  transactionService.getFunction = getFunction;
});

function getAggregateAccountSummary(accountNumber) {
  // cache here too
  let accountSummary = {};
  return services.findAccountSummary({id: accountNumber})
    .delay(3000) // intentional to make the microservice request "feel" slower since we are using memory connector
    .then(function(data) {
      accountSummary = data;
      console.log('>>>>>>>>>>> retrieved account summary');
    })
    .then(function() {
      return services.findAccount({id: accountNumber});
    })
    .then(function(data) {
      accountSummary.account = data;
      console.log('>>>>>>>>>>> retrieved account details');
    })
    .then(function() {
      return services.findCustomer({
        id: accountSummary.account.customerNumber,
      });
    })
    .then(function(data) {
      accountSummary.customer = data;
      console.log('>>>>>>>>>>> retrieved customer details');
    })
    .then(function() {
      return services.findTransaction({accountNumber: accountNumber});
    })
    .then(function(data) {
      accountSummary.transactions = data;
      console.log('>>>>>>>>>>> retrieved transaction details');
      return accountSummary;
    });
}

module.exports.findTransaction = function(input) {
  let find = transactionService.getFunction('Transaction', 'queryByAccount');
  return query({map: 'Transaction', key: input.accountNumber}, find, input);
};

module.exports.findAccountSummary = function(input) {
  let find = accountService.getFunction('AccountSummary', 'findById');
  return query({map: 'AccountSummary', key: input.accountNumber}, find, input);
};

module.exports.findAccount = function(input) {
  let find = accountService.getFunction('Account', 'findById');
  return query({map: 'Account', key: input.accountNumber}, find, input);
};

module.exports.findCustomer = function(input) {
  let find = customerService.getFunction('Customer', 'findById');
  return query({map: 'Customer', key: input.accountNumber}, find, input);
};

function getFunction(model, method) {
  let functionName = model + '_' + method;
  return Promise.promisify(this.createModel(model, {})[functionName]);
}

function query(input, fn, fnInput) {
  return fn(fnInput).then(data => {
    return data.obj;
  });
}
