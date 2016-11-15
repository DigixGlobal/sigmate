import fs from 'fs';
import prompt from 'prompt';
import bip39 from 'bip39';
import hdkey from 'ethereumjs-wallet/hdkey';

import {
  DEFAULT_PATH,
  DEFAULT_ACCOUNTS,
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

function generateKeystore({ label, mnemonic, password, path, accounts }) {
  const dest = `${path}/${label}`;
  // create dest if it doesn't exist
  if (!fs.existsSync(path)) { fs.mkdirSync(path); }
  if (!fs.existsSync(dest)) { fs.mkdirSync(dest); } else {
    // throw if it already exists
    throw new Error(`canceled - label is already in use: ${dest}`);
  }
  // generate mnemonic if required
  let usedMnemonic = mnemonic;
  if (!mnemonic) {
    usedMnemonic = bip39.generateMnemonic();
    process.stdout.write(`\nGenerated seed mnemonic:\n${usedMnemonic}\n`);
  }
  process.stdout.write(`\nGenerating ${accounts} accounts:\n`);
  const hd = hdkey.fromMasterSeed(usedMnemonic);
  new Array(parseInt(accounts, 10) || DEFAULT_ACCOUNTS).fill(undefined).forEach((k, i) => {
    const wallet = hd.deriveChild(i).getWallet();
    const filename = `${dest}/${wallet.getV3Filename()}`;
    fs.writeFileSync(filename, JSON.stringify(wallet.toV3(password)));
    process.stdout.write(`${filename}\n`);
  });
}

export default function (args) {
  // show commander prompt
  return populateArgs(args)
  .then(generateKeystore)
  .catch((err) => { process.stdout.write(`\n${err.message}\n`); });
}
