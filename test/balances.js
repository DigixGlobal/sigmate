/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import Web3 from 'web3';
import { expect } from 'chai';
import Sigmate from '../src';
import { accountsObject } from './_harness';


describe('balances', () => {
  it('should correctly set up the balances', (done) => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const fundAccounts = 1337;
    new Sigmate({ accounts: accountsObject, web3, fundAccounts }).then((sigmate) => {
      Object.keys(accountsObject).forEach((name) => {
        if (!isNaN(accountsObject[name].balance)) {
          expect(sigmate.accounts[name].minimumFunding).to.equal(accountsObject[name].balance);
        } else {
          expect(sigmate.accounts[name].minimumFunding).to.equal(fundAccounts);
        }
      });
      done();
    });
  }).timeout(1000 * 60);
});
