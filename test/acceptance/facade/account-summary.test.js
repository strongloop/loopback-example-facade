const debug = require('debug')('loopback:test:account-summary');
const expect = require('../../support/expect');
const request = require('request-promise');

describe('facade - account summary', () => {
  describe('GET /api/Accounts/summary?accountNumber=...', () => {
    it('returns the aggregated account info', () => {
      const accountNumber = 'CHK52321122';
      return request({
        uri: 'http://localhost:3000/api/Accounts/summary',
        qs: {
          accountNumber: accountNumber
        },
        json: true
      })
      .then(res => {
        debug(res);
        expect(res.accountNumber).to.equal(accountNumber);
        expect(res.account).to.eql({
          accountNumber: accountNumber,
          customerNumber: '000343223',
        });
        expect(res.customer).to.be.an('object');
        expect(res.transactions).to.have.length(5);
      });
    });
  });
});
