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
      account: Account.Account_findById({id: accountNumber}).get('obj'),
      transactions: app.models.Transaction.find(accountNumber),
    })
    .then(accountSummary => {
      const {Customer} = app.models;
      accountSummary.customer = Customer.findById(accountSummary.account.customerNumber);
      return Promise.props(accountSummary);
    });

    console.log('update shared cache with returned data');
    await Cache.set(key, accountSummary, {ttl: 60000});

    return accountSummary;
  };
};
