// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

const debug = require('debug')('loopback:test:vitals');
const expect = require('../../support/expect');
const request = require('request-promise');

describe('facade - vitals', () => {
  const facadeUrl = 'http://localhost:3000';

  describe('GET /facade/vitals', () => {
    it('returns the current health status of all microservices', () => {
      return request({
        uri: facadeUrl + '/api/Vitals',
        json: true
      })
      .then(res => {
        expect(res.status).to.equal('healthy');
        expect(res.dependencies.Account.status).to.equal('healthy');
        expect(res.dependencies.Customer.status).to.equal('healthy');
        expect(res.dependencies.Transaction.status).to.equal('healthy');
        expect(res.dependencies.Account.dependencies).to.deep.equal({
          AccountDB: { status: 'healthy' } });
        expect(res.dependencies.Customer.dependencies).to.deep.equal({
          CustomerDB: { status: 'healthy' } });
        expect(res.dependencies.Transaction.dependencies).to.deep.equal({
          TransactionDB: { status: 'healthy' } });
      });
    });
  });

  describe('GET /facade/vitals/docker', () => {
    it('returns OK', () => {
      return request({
        uri: facadeUrl + '/vitals/docker',
        json: true
      })
      .then(res => {
        expect(res).to.equal('ok');
      });
    });
  });
});
