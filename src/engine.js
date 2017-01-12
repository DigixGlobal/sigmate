import fs from 'fs';
import Wallet from 'ethereumjs-wallet';
import ProviderEngine from 'web3-provider-engine';
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';

import WalletSubprovider from './walletProvider';

import { DEFAULT_PATH } from './constants';

export default function ({ keystore, rpcUrl, virtual, prefund }) {

  const providerEngine = new ProviderEngine();

  let wallets;

  if (keystore) {
    const { path = DEFAULT_PATH, label, password } = keystore;
    const dest = `${path}/${label}`;
    if (!path) { throw new Error('Password not provided'); }
    if (!label) { throw new Error('Keystore name not provided'); }
    if (password === undefined) { throw new Error('Password not provided'); }
    if (!fs.existsSync(dest)) { throw new Error(`keystore not found: ${dest}`); }
    wallets = fs.readdirSync(dest).map((file) => {
      try {
        return Wallet.fromV3(fs.readFileSync(`${dest}/${file}`).toString(), password);
      } catch (e) {
        return null;
      }
    }).filter(w => w);
    providerEngine.addProvider(new WalletSubprovider(wallets));
  }

  if (rpcUrl) {
    const rpcSubprovider = new RpcSubprovider({ rpcUrl });
    providerEngine.addProvider(rpcSubprovider);
  }

  // defaults
  providerEngine.addProvider(new NonceTrackerSubprovider());
  // init
  providerEngine._fetchLatestBlock();

  return {
    providerEngine,
    coinbase: wallets && wallets[0].getAddressString(),
  };
}
