/* globals assert */
/* eslint-env mocha */

import Sigmate from '../src';

describe('Sigmate', () => {
  it('Should accept an array of names as paramaters', () => {
    const accountNames = ['primary', 'secondary'];
    const sigmate = new Sigmate(accountNames);
    console.log('got sigmate', sigmate);
    // assert.isEqual(sigma.accounts.)
  })
});
