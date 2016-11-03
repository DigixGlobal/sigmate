/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import Web3 from 'web3';
import { expect } from 'chai';
import Sigmate from '../src';


describe('balances', () => {
  it('should correctly set up the balances', () => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const prefund = 1337;
    return new Sigmate({ web3, prefund }).then((sigmate) => {
      return Promise.all(sigmate.accounts.map((address) => {
        return new Promise((resolve) => {
          web3.eth.getBalance(address, (err, balance) => {
            expect(balance.toNumber()).to.equal(prefund);
            resolve();
          });
        });
      }));
    });
  }).timeout(60 * 1000);
});
