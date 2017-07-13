import fs from 'fs';
import prompt from 'prompt';
import Lightwallet from 'eth-lightwallet';

import {
  DEFAULT_PATH,
  PREFIX,
} from '../constants';

function populateArgs({
  label,
  password,
  path = DEFAULT_PATH,
}) {
  return new Promise((resolve, reject) => {
    const requiredParams = [];
    process.stdout.write('\n⚠️  DANGER: You are about to print Seed and Private Keys!\n\n');
    if (label && password) {
      resolve({ label, password, path });
    }
    if (!label) {
      requiredParams.push({
        name: 'label',
        required: true,
        pattern: /^[0-9a-zA-Z-]+$/,
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
    prompt.start();
    return prompt.get(requiredParams, (err, res) => {
      if (err) { return reject(err); }
      return resolve({ label, password, path, ...res });
    });
  });
}

function generateKeystore({ label, path, password }) {
  const dest = `${path}/${PREFIX}${label}.json`;
  // throw if it already exists
  if (!fs.existsSync(dest)) {
    throw new Error(`Path does not exist: ${dest}`);
  }
  // generate mnemonic if required
  const ks = Lightwallet.keystore.deserialize(fs.readFileSync(dest));

  ks.keyFromPassword(password, (err, pwDerivedKey) => {
    if (err) throw err;
    const seed = ks.getSeed(pwDerivedKey);
    process.stdout.write(`\nPrivate key information for: ${dest}\n`);
    process.stdout.write(`\nSeed Mnemonic:\n${seed}\n\n`);
    // generate new address/private key pairs
    ks.getAddresses().forEach((a) => {
      const privateKey = ks.exportPrivateKey(a, pwDerivedKey);
      process.stdout.write(`Address:     ${a}\nPrivate Key: ${privateKey}\n\n`);
    });
  });
}

export default function (args) {
  // show commander prompt
  return populateArgs(args)
  .then(generateKeystore)
  .catch((err) => { process.stdout.write(`\n${err.message}\n`); });
}
