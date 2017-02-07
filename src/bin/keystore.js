import fs from 'fs';
import prompt from 'prompt';
import bip39 from 'bip39';
import Lightwallet from 'eth-lightwallet';

import {
  DEFAULT_PATH,
  DEFAULT_ACCOUNTS,
  PREFIX,
} from '../constants';

function populateArgs({
  label,
  password,
  mnemonic,
  accounts,
  path = DEFAULT_PATH,
}) {
  return new Promise((resolve, reject) => {
    const requiredParams = [];
    if (label && mnemonic && password) {
      resolve({ label, mnemonic, password, path, accounts });
    }
    if (!label) {
      requiredParams.push({
        name: 'label',
        required: true,
        pattern: /^[0-9a-zA-Z\-]+$/,
        description: 'Keystore label',
      });
    }
    if (!password) {
      requiredParams.push({
        name: 'password',
        hidden: true,
        required: true,
        description: 'Decryption password',
      });
    }
    if (!accounts) {
      requiredParams.push({
        name: 'accounts',
        pattern: /^[0-9]+$/,
        description: `Number of accounts (default ${DEFAULT_ACCOUNTS})`,
      });
    }
    if (!mnemonic) {
      requiredParams.push({
        name: 'mnemonic',
        description: '12 word mnemonic (optional)',
      });
    }
    prompt.start();
    return prompt.get(requiredParams, (err, res) => {
      if (err) { return reject(err); }
      return resolve({ label, mnemonic, password, path, accounts, ...res });
    });
  });
}

function generateKeystore({ label, mnemonic, password, path, accounts = DEFAULT_ACCOUNTS }) {
  const dest = `${path}/${PREFIX}${label}.json`;
  // create dest if it doesn't exist
  if (!fs.existsSync(path)) { fs.mkdirSync(path); }
  // throw if it already exists
  if (fs.existsSync(dest)) {
    throw new Error(`canceled - label is already in use: ${dest}`);
  }
  // generate mnemonic if required
  let seedPhrase = mnemonic;
  if (!mnemonic) {
    // TODO entropy, etc.
    seedPhrase = bip39.generateMnemonic();
    process.stdout.write(`\nGenerated seed mnemonic:\n${seedPhrase}\n`);
  }
  Lightwallet.keystore.createVault({
    password,
    seedPhrase,
  }, (err, ks) => {
    process.stdout.write(`\nGeneratied ${accounts} accounts:\n`);
    ks.keyFromPassword(password, (err2, pwDerivedKey) => {
      if (err2) throw err;
      // generate new address/private key pairs
      ks.generateNewAddress(pwDerivedKey, accounts);
      ks.getAddresses().forEach((a) => process.stdout.write(`${a}\n`));
      // save the keystore
      fs.writeFileSync(dest, ks.serialize());
      process.stdout.write(`\nSaved keystore:\n${dest}\n`);
    });
  });
}

export default function (args) {
  // show commander prompt
  return populateArgs(args)
  .then(generateKeystore)
  .catch((err) => { process.stdout.write(`\n${err.message}\n`); });
}
