'use strict';

const promise = require('bluebird');
const services = require('../../lib/services');

module.exports = function(Account) {

  Account.getAccountSummary = function(accountNumber) {
    let accountSummary = {};
    return services.findAccountSummary({id: accountNumber})
      .then(function(data) {
        accountSummary = data.obj;
        console.log(">>>>>>>>>>> retrieved account summary");
      })
      .then(function() {
        return services.findAccount({id: accountNumber})
      })
      .then(function(data) {
        accountSummary.account = data.obj;
        console.log(">>>>>>>>>>> retrieved account details");
      })
      .then(function() {
        return services.findCustomer({id: accountSummary.account.customerNumber})
      })
      .then(function(data) {
        accountSummary.customer = data.obj;
        console.log(">>>>>>>>>>> retrieved customer details");
      })
      .then(function() {
        return services.findTransaction({id: accountNumber})
      })
      .then(function(data) {
        accountSummary.transactions = data.obj;
        console.log(">>>>>>>>>>> retrieved transaction details");
        return accountSummary;
      });
  }

  Account.listAllAccounts = function(customerNumber, cb) {
    services.findAccount({id: accountNumber, accountNumber: accountNumber}, function(err, account) {
      if (err) return cb(err);
      cb(null, account.obj);
    });
  };
};
