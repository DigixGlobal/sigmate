#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
const args = minimist(process.argv.slice(2));
const command = args._[0];

import keystore from './keystore';
import list from './list';
const sigmate = { keystore, list };

if (sigmate[command]) {
  sigmate[command](args);
} else {
  const pkgPath = path.join(__dirname, '../../package.json');
  const { version } = JSON.parse(fs.readFileSync(pkgPath).toString());
  process.stdout.write(`
Sigmate v${version}

Usage:

$ sigmate [command]

Commands:

keystore      Create a new keystore
list          List existing keystores

Optional Flags:

--label      Unique name for keystore
--password   Decryption key for wallets
--accounts   Number of wallets to create in keystore
--path       Keystores location

`);
}
