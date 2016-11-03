/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import fs from 'fs';
import { expect } from 'chai';
import Sigmate from '../src';

import {
  testLabel as label,
  testLabelPath,
} from './_harness';

describe('accounts', () => {
  describe('keystore json file', () => {
    function cleanup() {
      if (fs.existsSync(testLabelPath)) { fs.unlinkSync(testLabelPath); }
    }
    before(cleanup);
    after(cleanup);
    it('should not save the keystore if a label is not supplied', () => {
      return new Sigmate().then(() => {
        expect(fs.existsSync(testLabelPath)).to.be.false;
      });
    });

    describe('persistence', () => {
      let persistentAddress;

      it('should save the keystore if a label is supplied', () => {
        return new Sigmate({ label }).then((sigmate) => {
          persistentAddress = sigmate.accounts[0];
          expect(persistentAddress).to.exist;
          expect(fs.existsSync(testLabelPath)).to.be.true;
        });
      });

      it('should read from an existing keystore if it exists', () => {
        return new Sigmate({ label }).then((sigmate) => {
          expect(sigmate.accounts[0]).to.equal(persistentAddress);
        });
      });
    });
  });

  describe('keystore generation', () => {
    it('should return the eth-lightwallet keystore', () => {
      return new Sigmate().then((sigmate) => {
        expect(sigmate.keystore).to.be.an.object;
      });
    });
  });

  describe('accounts generation', () => {
    const count = 13;
    it('generates accounts from an array of names', () => {
      return new Sigmate({ count }).then((sigmate) => {
        expect(count).to.equal(sigmate.accounts.length);
      });
    });
  });
});
