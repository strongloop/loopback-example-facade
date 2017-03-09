module.exports = function(Account) {
  Account.on('dataSourceAttached', function() {
    Account.find = function(filter, options, cb) {
      cb(null, [
        Math.random().toString().split('.')[1],
        Math.random().toString().split('.')[1],
        Math.random().toString().split('.')[1],
        Math.random().toString().split('.')[1],
        Math.random().toString().split('.')[1]
      ]);
    }
  });  
}
