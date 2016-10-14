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
      return Promise.all(Object.keys(accountsObject).map((name) => {
        return new Promise((resolve) => {
          const account = sigmate.accounts[name];
          const targetAmount = isNaN(accountsObject[name].balance) ? fundAccounts : accountsObject[name].balance;
          expect(account.minimumFunding).to.equal(targetAmount);
          web3.eth.getBalance(account.address, (err, balance) => {
            expect(balance.toNumber()).to.equal(targetAmount);
            resolve();
          });
        });
      })).then(() => { done(); });
    });
  }).timeout(1000 * 60);
});
