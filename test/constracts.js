/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import { expect } from 'chai';
import Sigmate from '../src';

import { mockContract, accountsArray } from './_harness';

describe('contracts', () => {
  before(() => { global.MockContract = mockContract; });
  after(() => { delete global.MockContract; });
  it('should update the mock contract with the hooked web3 provider', (done) => {
    expect(global.MockContract.currentProvider.transaction_signer).to.not.exist;
    new Sigmate(accountsArray).then((sigmate) => {
      // ensure it doesn't mess up the existig globals
      expect(global.MockContract.currentProvider.transaction_signer).to.not.exist;
      // ensure we have a contract with the right signer
      expect(sigmate.contracts.MockContract.currentProvider.transaction_signer).to.exist;
      done();
    });
  });
});
