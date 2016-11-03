/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import { expect } from 'chai';
import Sigmate from '../src';

import { mockContract } from './_harness';

global.MockContract = mockContract;

describe('contracts', () => {
  it('should update the mock contract with the hooked web3 provider', () => {
    return new Sigmate().then((sigmate) => {
      // ensure we have a contract with the right signer
      expect(sigmate.contracts.MockContract.currentProvider.transaction_signer).to.exist;
    });
  });
});
