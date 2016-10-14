/* eslint-env mocha */
/* eslint-disable no-console, no-unused-expressions */

import fs from 'fs';
import { expect } from 'chai';
import Sigmate from '../src';

import {
  accountsArray,
  accountsObject,
  testLabel,
  testLabelPath,
} from './_harness';

describe('accounts', () => {
  describe('keystore json file', () => {
    function cleanup() {
      if (fs.existsSync(testLabelPath)) { fs.unlinkSync(testLabelPath); }
    }
    before(cleanup);
    after(cleanup);
    it('should not save the keystore if a label is not supplied', (done) => {
      new Sigmate(accountsArray).then(() => {
        expect(fs.existsSync(testLabelPath)).to.be.false;
        done();
      });
    });

    describe('persistence', () => {
      let persistentAddress;

      it('should save the keystore if a label is supplied', (done) => {
        new Sigmate(accountsArray, testLabel).then((sigmate) => {
          persistentAddress = sigmate.accounts[accountsArray[0]].address;
          expect(persistentAddress).to.exist;
          expect(fs.existsSync(testLabelPath)).to.be.true;
          done();
        });
      });

      it('should read from an existing keystore if it exists', (done) => {
        new Sigmate({ accounts: accountsObject, label: testLabel }).then((sigmate) => {
          expect(sigmate.accounts[accountsArray[0]].address).to.equal(persistentAddress);
          done();
        });
      });
    });
  });

  describe('keystore generation', () => {
    it('should return the eth-lightwallet keystore', (done) => {
      new Sigmate(accountsArray).then((sigmate) => {
        expect(sigmate.keystore).to.be.an.object;
        done();
      });
    });
  });

  describe('accounts generation', () => {
    function accountsTester(sigmate, callback) {
      const { accounts } = sigmate;
      const accountNames = Object.keys(accounts);
      expect(accountNames.length).to.equal(accountsArray.length);
      accountNames.forEach((account) => {
        expect(accounts[account]).to.be.an('object');
        expect(accounts[account].address).to.be.a('string');
      });
      callback();
    }
    it('generates accounts from an array of names', (done) => {
      new Sigmate(accountsArray)
      .then((sigmate) => { accountsTester(sigmate, done); });
    });
    it('generates accounts from an object of names', (done) => {
      new Sigmate({ accounts: accountsObject })
      .then((sigmate) => { accountsTester(sigmate, done); });
    });
  });
});
