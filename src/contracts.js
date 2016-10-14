import HookedWeb3Provider from 'hooked-web3-provider';

export default function ({ keystore }) {
  const contracts = {};
  // find truffle contracts in global namespace
  Object.keys(global).forEach((key) => {
    if (global[key] && global[key].contract_name) {
      // clone the global
      const contract = { ...global[key] };
      // create the provider for web3 transactions using ks
      const hookedProvider = new HookedWeb3Provider({
        ...contract.currentProvider,
        transaction_signer: keystore,
      });
      contract.setProvider(hookedProvider);
      contracts[key] = contract;
    }
  });
  return contracts;
}
