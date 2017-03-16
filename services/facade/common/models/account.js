'use strict';

const app = require('../../server/server');
const Promise = require('bluebird');

// NOTE: View `console.log` output in the docker-compose logs

module.exports = function(Account) {
  Account.getAccount = async function(accountNumber) {
    return Account.Account_findById({id: accountNumber}).get('obj');
  };

  Account.getAccountSummary = async function(accountNumber, cache) {
    const Cache = app.models.Cache;

    // DEMO(ritch): explain why url + acctNum instead of just acctNum
    const key = '/api/Account/summary?accountNumber=' + accountNumber;

    console.log('checking facade level cache');
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

    console.log('update cache with returned data');
    // ttl should be short because some data changes often
    // account aggressive infinite ttl at microservice level
    // customer aggresive infinite ttl
    // transaction non-aggressive very short ttl
    // DEMO(ritch): change to 60s after, explain why 60s to crowd
    await Cache.set(key, accountSummary, {ttl: 60000}); // 10s for testing

    return accountSummary;
  };
};
