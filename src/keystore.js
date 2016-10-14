/* eslint-disable no-param-reassign */

import fs from 'fs';
import LightWallet from 'eth-lightwallet';
import { VAULT_DIRECTORY, PASSWORD } from './constants';

function getKeystoreFilename(label) {
  if (!label) { return false; }
  const filename = `sigmate-keystore-${label}.json`;
  return `${VAULT_DIRECTORY}/${filename}`;
}

function writeKeystore({ label, ks }) {
  // create a vault directory if one doesn't exist
  if (!fs.existsSync(VAULT_DIRECTORY)) {
    fs.mkdirSync(VAULT_DIRECTORY);
  }
  // get JSON formatted data
  const serialized = ks.serialize();
  // write the file
  return fs.writeFileSync(getKeystoreFilename(label), serialized);
}

function readKeystore(label) {
  const ksFilename = getKeystoreFilename(label);
  if (!ksFilename || !fs.existsSync(ksFilename)) { return false; }
  const jsonData = fs.readFileSync(ksFilename, 'utf8');
  return LightWallet.keystore.deserialize(jsonData);
}

function createKeystore() {
  return new Promise((resolve) => {
    LightWallet.keystore.createVault({ password: PASSWORD }, (err, ks) => {
      resolve(ks);
    });
  });
}

export default function ({ accounts, label }) {
  const generatedAccounts = {};
  // map accounts config object to empty object
  Object.keys(accounts).forEach((account) => {
    generatedAccounts[account] = {};
  });
  // if no label is supplied, we create a temporary keystore
  // if there is a label, read/save to the saved label's keystore
  return new Promise((resolve) => {
    // try to read the keystore if there is a label
    const readKs = label && readKeystore(label);
    // resolve promise if we have it
    if (readKs) { return resolve(readKs); }
    // keystore doesn't exist, we need to create it.
    return createKeystore().then(resolve);
  }).then((ks) => {
    // get the key from the keystore for later use
    return new Promise((resolve) => {
      // get the pwDerivedKey
      ks.keyFromPassword(PASSWORD, (err, pwDerivedKey) => {
        resolve({ ks, pwDerivedKey });
      });
    });
  }).then(({ ks, pwDerivedKey }) => {
    // create a a name map within the keystore
    ks.ksData.sigmateNameMap = ks.ksData.sigmateNameMap || {};
    // determine if name is already assigned an address
    const newNames = Object.keys(accounts).filter((name) => {
      if (!ks.ksData.sigmateNameMap[name]) { return true; }
      // get the address if it's already assigned
      generatedAccounts[name].address = ks.ksData.sigmateNameMap[name];
      return false;
    });
    // generate new addresses for each of the new names
    ks.generateNewAddress(pwDerivedKey, newNames.length);
    const addresses = ks.getAddresses();
    newNames.forEach((name, i) => {
      // assign address to name
      const address = addresses[addresses.length - newNames.length + i];
      // write to keystore and accounts list
      generatedAccounts[name].address = ks.ksData.sigmateNameMap[name] = address;
    });
    // save the keystore if we have any newNames
    if (label && newNames.length) {
      writeKeystore({ ks, label });
    }
    // make the password provider always sign with the default apssword
    ks.passwordProvider = function provider(callback) {
      callback(null, PASSWORD);
    };
    // return the keystore and the accounts with addresses
    return { keystore: ks, accounts: generatedAccounts };
  });
}
