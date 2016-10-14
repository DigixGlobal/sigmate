/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import { expect } from 'chai';
import Sigmate from '../src';

import { accountsArray } from './_harness';

describe('web3', () => {
  it('should return a web3 object with the transaction signer', (done) => {
    new Sigmate(accountsArray).then((sigmate) => {
      expect(sigmate.web3).to.be.an.object;
      expect(sigmate.web3.currentProvider).to.exist;
      expect(sigmate.web3.currentProvider.transaction_signer).to.exist;
      done();
    });
  });
});
