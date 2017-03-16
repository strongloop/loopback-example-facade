const chai = require('chai');
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);
chai.use(require('chai-subset'));

module.exports = chai.expect;
