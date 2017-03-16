const debug = require('debug')('loopback:test:vitals');
const expect = require('../../support/expect');
const request = require('request-promise');

describe('facade - vitals', () => {
  const facadeUrl = 'http://localhost:3000';

  describe('GET /facade/vitals', () => {
    it('returns the current health status of all microservices', () => {
      return request({
        uri: facadeUrl + '/vitals',
        json: true
      })
      .then(res => {
        expect(res.status).to.equal('healthy');
        expect(res.dependencies).to.eql({
          account: {
            status: 'healthy',
            dependencies: {
              accountDB: {
                status: 'healthy'
              }
            }
          },
          customer: {
            status: 'healthy',
            dependencies: {
              customerDB: {
                status: 'healthy'
              }
            }
          },
          transaction: {
            status: 'healthy',
            dependencies: {
              transactionDB: {
                status: 'healthy'
              }
            }
          },
        });
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
