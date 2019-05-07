// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

'use strict';

const app = require('../../server/server');
const Promise = require('bluebird');

// NOTE: View `console.log` output in the docker-compose logs

module.exports = function(Account) {
  Account.getAccount = async function(accountNumber) {
    return Account.Account_findById({id: accountNumber}).get('obj');
  };

  Account.getAccountSummary = async function(accountNumber, cache) {
    console.log('checking shared cache');
    const Cache = app.models.Cache;
    const key = '/api/Account/summary?accountNumber=' + accountNumber;
    let accountSummary = await Cache.get(key);
    if (accountSummary && cache !== false) {
      const ttl = await Cache.ttl(key);
      console.log('cache hit, return cache data, ttl:', ttl);
      accountSummary.cache = ttl;
      return accountSummary;
    }

    console.log('cache miss, retrieve data from microservices');
    const {Transaction} = app.models;
    accountSummary = await Promise.props({
      account: Account.getAccount(accountNumber),
      transactions: app.models.Transaction.find(accountNumber),
    })
    .then(data => {
      const {Customer} = app.models;
      const customerNumber = data.account.customerNumber;
      data.customer = Customer.find(customerNumber);
      return Promise.props(data);
    });

    console.log('update shared cache with returned data');
    await Cache.set(key, accountSummary, {ttl: 60000});

    return accountSummary;
  };
};
