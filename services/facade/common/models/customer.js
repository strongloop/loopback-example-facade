'use strict';

module.exports = function(Customer) {
  Customer.findById = function(customerNumber) {
    // clean this up with proper promise return shortcut
    return Customer.Customer_findById({id: customerNumber}).then(res => {
      return res.obj;
    });
  };
};
