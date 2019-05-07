// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

'use strict';

module.exports = function(Customer) {
  Customer.find = function(customerNumber) {
    // clean this up with proper promise return shortcut
    return Customer.Customer_findById({id: customerNumber}).then(res => {
      return res.obj;
    });
  };
};
