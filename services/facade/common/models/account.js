'use strict';

const app = require('../../server/server');
const services = require('../../lib/services');

// NOTE: View `console.log` output in the docker-compose logs

module.exports = function(Account) {
  Account.getAccountSummary = function(accountNumber, cache) {
    const Cache = app.models.Cache;

    // DEMO(ritch): explain why url + acctNum instead of just acctNum
    const key = '/api/Account/summary?accountNumber=' + accountNumber;

    console.log('checking the facade level cache');
    return Cache.get(key).then(accountSummary => {
      if (accountSummary && cache !== false) {
        return Cache.ttl(key).then(ttl => {
          console.log('cache hit, return cache data, ttl:', ttl);
          accountSummary.cache = ttl;
          return accountSummary;
        });
      }

      console.log('cache miss, get data from microservice');
      return services.getAggregateAccountSummary(accountNumber)
        .then(accountSummary => {
          // ttl should be short because some data changes often
          // account aggressive infinite ttl at microservice level
          // customer aggresive infinite ttl
          // transaction non-aggressive very short ttl
          console.log('update cache with returned data');
          // DEMO(ritch): change to 60s after, explain why 60s to crowd
          return Cache.set(key, accountSummary, {ttl: 60000}) // 10s for testing
            .return(accountSummary);
        });
    });
  };

  Account.getAccountByNumber = function(accountNumber) {
    return services.findAccount({id: accountNumber});
  };
};
