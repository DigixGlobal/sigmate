import fs from 'fs';
import Wallet from 'ethereumjs-wallet';
import ProviderEngine from 'web3-provider-engine';
import DefaultFixture from 'web3-provider-engine/subproviders/default-fixture';
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer';
import CacheSubprovider from 'web3-provider-engine/subproviders/cache';
import FilterSubprovider from 'web3-provider-engine/subproviders/filters';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';

import SigmateSubprovider from './subprovider';

import { DEFAULT_PATH } from './constants';

export default function ({ keystore, rpcUrl }) {
  const { path = DEFAULT_PATH, label, password } = keystore;
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
  providerEngine.addProvider(new DefaultFixture());
  providerEngine.addProvider(new NonceTrackerSubprovider());
  providerEngine.addProvider(new SanitizingSubprovider());
  providerEngine.addProvider(new CacheSubprovider());
  providerEngine.addProvider(new FilterSubprovider());
  providerEngine.addProvider(new SigmateSubprovider(wallets));
  const rpcSubprovider = new RpcSubprovider({ rpcUrl });
  // TODO additional logging
  // const oldHandler = rpcSubprovider.handleRequest;
  // rpcSubprovider.handleRequest = (...args) => {
  //   console.log('handling', args);
  //   return oldHandler.apply(rpcSubprovider, args);
  // }
  // providerEngine.on('error', err => console.log('err', err.stack));
  providerEngine.addProvider(rpcSubprovider);
  providerEngine.start();
  // TODO prefund!
  return {
    providerEngine,
    coinbase: wallets[0].getAddressString(),
  };
}
