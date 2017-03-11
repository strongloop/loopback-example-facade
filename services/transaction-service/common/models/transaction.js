module.exports = function(Transaction) {
  Transaction.validatesInclusionOf('transactionType', {in: ['debit', 'credit']});
}
