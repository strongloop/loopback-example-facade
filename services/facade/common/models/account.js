'use strict';

const app = require('../../server/server');
const Promise = require('bluebird');

// NOTE: View `console.log` output in the docker-compose logs

module.exports = function(Account) {
  function getAggregateAccountSummary(accountNumber) {
    const {Transaction} = app.models;
    return Promise.props({
      account: Account.getSummary(accountNumber),
      customer: Account.getCustomer(accountNumber),
      transactions: Transaction.find(accountNumber),
    });
  }

  Account.getAccountSummary = async function(accountNumber, cache) {
    const Cache = app.models.Cache;

    // DEMO(ritch): explain why url + acctNum instead of just acctNum
    const key = '/api/Account/summary?accountNumber=' + accountNumber;

    console.log('checking the facade level cache');
    let accountSummary = await Cache.get(key);
    if (accountSummary && cache !== false) {
      const ttl = await Cache.ttl(key);
      console.log('cache hit, return cache data, ttl:', ttl);
      accountSummary.cache = ttl;
      return accountSummary;
    }

    console.log('cache miss, get data from microservice');
    accountSummary = await getAggregateAccountSummary(accountNumber);
    // ttl should be short because some data changes often
    // account aggressive infinite ttl at microservice level
    // customer aggresive infinite ttl
    // transaction non-aggressive very short ttl
    console.log('update cache with returned data');
    // DEMO(ritch): change to 60s after, explain why 60s to crowd
    await Cache.set(key, accountSummary, {ttl: 60000}); // 10s for testing

    return accountSummary;
  };

  Account.getAccountByNumber = function(accountNumber) {
    return Account.Account_findById({id: accountNumber}).get('obj');
  };

  Account.getSummary = function(accountNumber) {
    return Account.AccountSummary_findById({id: accountNumber}).get('obj');
  }

  Account.getCustomer = async function(accountNumber) {
    const {Customer} = app.models;
    const data = await Account.getAccountByNumber(accountNumber);
    return Customer.findById(data.customerNumber);
  }
};
