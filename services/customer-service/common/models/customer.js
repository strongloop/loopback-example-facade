module.exports = function(Customer) {
  Customer.on('dataSourceAttached', function() {
    Customer.find = function(filter, options, cb) {
      cb(null, [new Customer({
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
      })]);
    }
  });
}
