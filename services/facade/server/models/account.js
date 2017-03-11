'use strict';

const app = require('../server');

module.exports = function(Account) {
  let accountService, customerService, transactionService;

  app.on('started', function() {
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

  Account.getAccountSummary = function(accountNumber, cb) {
    let findCustomer = customerService.getFunction('Customer', 'findById');
    let findAccount = accountService.getFunction('Account', 'findById');
    let findAccountSummary = accountService.getFunction('AccountSummary', 'findById');
    let findTransaction = transactionService.getFunction('Transaction', 'findById');
    findAccountSummary({id: accountNumber, accountNumber: accountNumber}, function(err, accountSummary) {
      if (err) return cb(err);
      accountSummary = accountSummary.obj;
      findAccount({id: accountNumber, accountNumber: accountNumber}, function(err, account) {
        if (err) return cb(err);
        findCustomer({id: account.obj.customerNumber, customerNumber: account.obj.customerNumber}, function(err, customer) {
          if (err) return cb(err);
          accountSummary.customer = customer.obj;
          accountSummary.account = account.obj;
          cb(null, accountSummary);
        });
      });
    });
  }

  Account.listAllAccounts = function(customerNumber, cb) {
    let findAccount = accountService.getFunction('Account', 'find');
    findAccount({}, function(err, account) {
      if (err) return cb(err);
      cb(null, account.obj);
    });
  };
};
