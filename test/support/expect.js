const chai = require('chai');
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

module.exports = chai.expect;
