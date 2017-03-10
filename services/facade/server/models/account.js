'use strict';

const app = require('../server');

module.exports = function(Account) {
  let accountService, customerService;

  app.on('started', function() {
    customerService = app.dataSources.Customer;
    accountService = app.dataSources.Account;
    customerService.getFunction = getFunction;
    accountService.getFunction = getFunction;
  });

  function getFunction(model, method) {
    let functionName = model + '_' + method;
    return this.createModel(model, {})[functionName];
  }

  Account.getAccountSummary = function(accountNumber, cb) {
    let findCustomer = customerService.getFunction('Customer', 'find');
    let findAccount = accountService.getFunction('Account', 'find');
    const accountSummary = {};
    findCustomer({}, function(err, customer) {
      if (err) return cb(err);
      findAccount({}, function(err, account) {
        if (err) return cb(err);
        accountSummary.customer = customer.obj;
        accountSummary.account = account.obj;
        cb(null, accountSummary);
      });
    });
  }
};
