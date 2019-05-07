// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

const chai = require('chai');
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);
chai.use(require('chai-subset'));

module.exports = chai.expect;
