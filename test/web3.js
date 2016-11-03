/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import { expect } from 'chai';
import Sigmate from '../src';

describe('web3', function () {
  it('should return a web3 object with the transaction signer', function () {
    new Sigmate().then((sigmate) => {
      expect(sigmate.web3.currentProvider.transaction_signer).to.exist;
    });
  });
});
