import fs from 'fs';

import { DEFAULT_PATH } from '../constants';

export default function ({ path = DEFAULT_PATH }) {
  if (!fs.existsSync(path)) {
    process.stdout.write(`path not found: ${path}\n`);
    process.exit();
  }
  fs.readdirSync(path).forEach((label) => {
    const dir = `${path}/${label}`;
    if (!fs.lstatSync(dir).isDirectory()) { return; }
    const keys = fs.readdirSync(dir);
    process.stdout.write(`\n${label} [${keys.length}]\n`);
    keys.forEach((key) => {
      const address = key.split('-').pop();
      process.stdout.write(`${address}\n`);
    });
  });
  process.stdout.write('\n');
}
