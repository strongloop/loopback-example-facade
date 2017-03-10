'use strict';

module.exports = function(Account) {
  Account.getAccountSummary = function(accountNumber, cb) {
    let Customer = Account.app.models.Customer;

    Customer.dataSource.connector.client.Customer['Customer_find']({}, function(result) {
      cb(null, result.obj);
    });
  }

  Account.listAllAccounts = function(customerNumber) {
    return Promise.resolve([
      Math.random().toString().split('.')[1],
      Math.random().toString().split('.')[1],
      Math.random().toString().split('.')[1],
      Math.random().toString().split('.')[1],
      Math.random().toString().split('.')[1]
    ]);
  };
};


/*
return Promise.resolve(new Account({
      accountNumber: accountNumber,
      accountInfo: {
        avgBalance: 398.93,
        minimumBalance: 10.00,
        branch: 'Foster City',
        type: 'Checking'
      },
      customerNumber: '0008893939',
      customerInfo: {
        firstName: 'Homer',
        lastName: 'Simpson',
        customerSince: new Date(),
        address: {
          street: '742 Evergreen Terrace',
          lastUpdated: new Date(),
          zip: 95555,
          city: 'Springfield',
          state: 'OR'
        }
      },
      transactions: [
        {
          type: 'debit',
          ammount: 3.93,
          description: 'Starbucks'
        }
      ],
      balance: 85.84
    }));
*/