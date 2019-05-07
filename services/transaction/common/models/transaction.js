// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

module.exports = function(Transaction) {
  Transaction.validatesInclusionOf('transactionType', {in: ['debit', 'credit']});

  Transaction.queryByAccount = function(accountNumber) {
    return Transaction.find({
      where: {
        accountNo: accountNumber
      }
    });
  };
};
