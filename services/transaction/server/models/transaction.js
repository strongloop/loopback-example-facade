module.exports = function(Transaction) {
  Transaction.validatesInclusionOf('transactionType', {in: ['debit', 'credit']});

  Transaction.queryByAccount = function(accountNumber, cb) {
    return Transaction.find({
      where: {
        accountNo: accountNumber
      }
    })
    .then(results => {
      return results;
    });
  };
};
