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

function createKeystore(password) {
  return new Promise((resolve) => {
    LightWallet.keystore.createVault({ password }, (err, ks) => {
      resolve(ks);
    });
  });
}

export default function ({ count = 5, users, label, password = PASSWORD }) {
  // if no label is supplied, we create a temporary keystore
  // if there is a label, read/save to the saved label's keystore
  return new Promise((resolve) => {
    // try to read the keystore if there is a label
    const readKs = label && readKeystore(label);
    // resolve promise if we have it
    if (readKs) { return resolve(readKs); }
    // keystore doesn't exist, we need to create it.
    return createKeystore(password).then(resolve);
  }).then((ks) => {
    // get the key from the keystore for later use
    return new Promise((resolve) => {
      // get the pwDerivedKey
      ks.keyFromPassword(password, (err, pwDerivedKey) => {
        resolve({ ks, pwDerivedKey });
      });
    });
  }).then(({ ks, pwDerivedKey }) => {
    const addressCount = users.length || count;
    // count number of addresses that already exist
    const existingAddresses = ks.getAddresses();
    // check if we need to generate new ones
    if (existingAddresses.length < addressCount) {
      // generat the reuqired number of new addresses
      ks.generateNewAddress(pwDerivedKey, addressCount - existingAddresses.length);
      // save the keystore if we have generated new addresses
      if (label) {
        writeKeystore({ ks, label });
      }
    }
    // get the new address list, trim it to the number requested
    const accounts = ks.getAddresses().slice(0, addressCount).map(a => `0x${a}`);
    // make the password provider always sign with the default apssword
    ks.passwordProvider = function provider(callback) {
      callback(null, password);
    };
    // assign username to addresses
    const mappedUsers = {};
    users.forEach((k, i) => { mappedUsers[k] = accounts[i]; });
    // return the keystore and the count with accounts
    return { keystore: ks, accounts, users: mappedUsers };
  });
}
