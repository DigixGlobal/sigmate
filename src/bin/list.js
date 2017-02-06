import fs from 'fs';
import Lightwallet from 'eth-lightwallet';

import { DEFAULT_PATH, PREFIX } from '../constants';

export default function ({ path = DEFAULT_PATH }) {
  if (!fs.existsSync(path)) {
    process.stdout.write(`path not found: ${path}\n`);
    process.exit();
  }
  fs.readdirSync(path).filter(str => str.indexOf(PREFIX) === 0).forEach((label) => {
    const filename = `${path}/${label}`;
    const serialized = fs.readFileSync(filename);
    const ks = Lightwallet.keystore.deserialize(serialized);
    const addresses = ks.getAddresses();
    process.stdout.write(`\n${filename} [${addresses.length}]\n`);
    addresses.forEach((a) => process.stdout.write(`${a}\n`));
  });
  process.stdout.write('\n');
}
