import fs from 'fs';
import Wallet from 'ethereumjs-wallet';
import ProviderEngine from 'web3-provider-engine';

import SigmateSubprovider from './subprovider';

import { DEFAULT_PATH } from './constants';

export default function ({ path = DEFAULT_PATH, label, password }) {
  const dest = `${path}/${label}`;
  if (!path) { throw new Error('Password not provided'); }
  if (!label) { throw new Error('Keystore name not provided'); }
  if (password === undefined) { throw new Error('Password not provided'); }
  if (!fs.existsSync(dest)) { throw new Error(`keystore not found: ${dest}`); }

  const wallets = fs.readdirSync(dest).map((file) => {
    try {
      return Wallet.fromV3(fs.readFileSync(`${dest}/${file}`).toString(), password);
    } catch (e) {
      return null;
    }
  }).filter(w => w);

  const providerEngine = new ProviderEngine();
  providerEngine.addProvider(new SigmateSubprovider(wallets));
  return {
    providerEngine,
    coinbase: wallets[0].getAddressString(),
  };
}
