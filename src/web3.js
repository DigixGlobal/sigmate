import Web3 from 'web3';
import HookedWeb3Provider from 'hooked-web3-provider';

export default function ({ keystore, provider }) {
  // get or instantiate the provider
  const web3 = provider || new Web3();
  // create the provider for web3 transactions using ks
  const hookedProvider = new HookedWeb3Provider({
    ...web3.currentProvider,
    transaction_signer: keystore,
  });
  // update the web3 instance to use our new provider
  web3.setProvider(hookedProvider);
  // return the updated provider
  return web3;
}
