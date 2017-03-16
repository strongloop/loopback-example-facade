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
      return app.models.Customer.findById(accountSummary.account.customerNumber);
    })
    .then(function(data) {
      accountSummary.customer = data;
      console.log('>>>>>>>>>>> retrieved customer details');
    })
    .then(function() {
      return app.models.Transaction.find(accountNumber);
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
  const Cache = app.models.Cache;

  // DEMO(ritch): explain why url + acctNum instead of just acctNum
  const key = '/api/Accounts/' + input.accountNumber;

  console.log('checking the facade level cache');
  return Cache.get(key).then(accountInfo => {
    if (accountInfo) {
      return Cache.ttl(key).then(ttl => {
        console.log('cache hit, return cache data, ttl:', ttl);
        accountInfo.cache = ttl;
        return accountInfo;
      });
    }

    console.log('cache miss, get data from microservice');
    return query({map: 'Account', key: input.accountNumber}, find, input)
      .then(accountInfo => {
        // ttl should be short because some data changes often
        // account aggressive infinite ttl at microservice level
        // customer aggresive infinite ttl
        // transaction non-aggressive very short ttl
        console.log('update cache with returned data');
        // DEMO(ritch): change to 60s after, explain why 60s to crowd
        return Cache.set(key, accountInfo, {ttl: 60000}) // 10s for testing
          .return(accountInfo);
      });
  });
};

module.exports.findCustomer = function(input) {
  let find = customerService.getFunction('Customer', 'findById');
  return query({map: 'Customer', key: input.accountNumber}, find, input);
};

function getFunction(model, method) {
  let functionName = model + '_' + method;
  return this.createModel(model, {})[functionName];
}

function query(input, fn, fnInput) {
  return fn(fnInput).then(data => {
    return data.obj;
  });
}
