import { VAULT_DIRECTORY } from '../src/constants';

export const count = 13;
export const testLabel = 'sigmate_testing';
export const testLabelPath = `${VAULT_DIRECTORY}/sigmate-keystore-${testLabel}.json`;

export const mockContract = {
  currentProvider: { },
  contract_name: 'MockContract',
  setProvider(provider) {
    this.currentProvider = provider;
  },
};
