module.exports = function(AccountSummary) {
  AccountSummary.on('dataSourceAttached', function() {
    AccountSummary.find = function(filter, options, cb) {
      cb(null, new AccountSummary({
        avgBalance: 398.93,
        minimumBalance: 10.00,
        branch: 'Foster City',
        type: 'Checking',
        balance: 85.84
      }));
    }
  });
}
