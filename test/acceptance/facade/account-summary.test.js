// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

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
        expect(res.account).to.eql({
          accountNumber: accountNumber,
          avgBalance: 398.93,
          balance: 85.84,
          branch: 'Foster City',
          customerNumber: '000343223',
          minimumBalance: 10,
          type: 'Checking',
        });
        expect(res.customer).to.containSubset({
          customerNumber: '000343223',
          firstName: 'Homer',
          lastName: 'Simpson',
        });
        expect(res.transactions).to.have.length(5);
      });
    });
  });
});
