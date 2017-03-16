'use strict';

module.exports = function(Transaction) {
  Transaction.find = function(accountNumber) {
    // clean this up with proper promise return shortcut
    return Transaction.Transaction_queryByAccount({accountNumber: accountNumber}).then(res => {
      return res.obj;
    });
  };
};
