module.exports = function(Transaction) {
  Transaction.validatesInclusionOf('transactionType', {in: ['debit', 'credit']});

  Transaction.queryByAccount = function(accountNumber, cb) {
    Transaction.find(function(err, list) {
      if(err) return cb(err);
      const transactions = [];
      list.forEach(function(item) {
        if(item.accountNo === accountNumber) {
          transactions.push(item);
        }
      });
      cb(null, transactions);
    });
  }
}
