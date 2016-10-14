import { VAULT_DIRECTORY } from '../src/constants';

export const accountsArray = ['primary', 'secondary', 'tertiary'];
export const accountsObject = {
  [accountsArray[0]]: { balance: 1000 },
  [accountsArray[1]]: { balance: 0 },
  [accountsArray[2]]: true,
};
export const testLabel = 'sigmate_testing';
export const testLabelPath = `${VAULT_DIRECTORY}/sigmate-keystore-${testLabel}.json`;

export const mockContract = {
  currentProvider: { },
  contract_name: 'MockContract',
  setProvider(provider) {
    this.currentProvider = provider;
  },
};
