'use strict';

const app = require('../server');
const promise = require('bluebird');

module.exports = function(Account) {
  let customerService, accountService, transactionService;

  Account.getAccountSummary = function(accountNumber) {
    let accountSummary = {};
    return findAccountSummary({id: accountNumber, accountNumber: accountNumber})
      .then(function(data) {
        accountSummary = data.obj;
        console.log("summary", accountSummary);
      })
      .then(function() {
        return findAccount({id: accountNumber, accountNumber: accountNumber})
      })
      .then(function(data) {
        accountSummary.account = data.obj;
        console.log("account" , data.obj);
      })
      .then(function() {
        return findCustomer({id: accountSummary.account.customerNumber, customerNumber: accountSummary.account.customerNumber})
      })
      .then(function(data) {
        console.log(data);
        accountSummary.customer = data.obj;
      })
      .then(function() {
        return findTransaction({id: accountNumber, accountNumber: accountNumber})
      })
      .then(function(data) {
        console.log(data);
        accountSummary.transactions = data.obj;
        return accountSummary;
      });
  }

  Account.listAllAccounts = function(customerNumber, cb) {
    let findAccount = accountService.getFunction('Account', 'find');
    findAccount({}, function(err, account) {
      if (err) return cb(err);
      cb(null, account.obj);
    });
  };

  app.on('started', function(){
    customerService = app.dataSources.Customer;
    accountService = app.dataSources.Account;
    transactionService = app.dataSources.Transaction;
    customerService.getFunction = getFunction;
    accountService.getFunction = getFunction;
    transactionService.getFunction = getFunction;
  });

  function findTransaction(input) {
    let find = transactionService.getFunction('Transaction', 'queryByAccount');
    return new Promise(function (resolve, reject) {
      find(input, function(err, data) {
        if (err) return reject(new Error(err));
        resolve(data);
      });
    });
  }

  function findAccountSummary(input) {
    let find = accountService.getFunction('AccountSummary', 'findById');
    return new Promise(function (resolve, reject) {
      find(input, function(err, data) {
        if (err) return reject(new Error(err));
        resolve(data);
      });
    });
  }

  function findAccount(input) {
    let find = accountService.getFunction('Account', 'findById');
    return new Promise(function (resolve, reject) {
      find(input, function(err, data) {
        if (err) return reject(new Error(err));
        resolve(data);
      });
    });
  }

  function findCustomer(input) {
    let find = customerService.getFunction('Customer', 'findById');
    return new Promise(function (resolve, reject) {
      find(input, function(err, data) {
        if (err) return reject(new Error(err));
        resolve(data);
      });
    });
  }

  function getFunction(model, method) {
    let functionName = model + '_' + method;
    return this.createModel(model, {})[functionName];
  }
};
