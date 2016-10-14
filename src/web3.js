import Web3 from 'web3';
import HookedWeb3Provider from 'hooked-web3-provider';

export default function ({ keystore, web3 }) {
  // get or instantiate the web3
  const newWeb3 = web3 || global.web3 || new Web3();
  // create the provider for web3 transactions using ks
  const hookedProvider = new HookedWeb3Provider({
    ...newWeb3.currentProvider,
    transaction_signer: keystore,
  });
  // update the web3 instance to use our new provider
  newWeb3.setProvider(hookedProvider);
  // return the updated provider
  return newWeb3;
}
