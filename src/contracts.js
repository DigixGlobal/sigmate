import HookedWeb3Provider from 'hooked-web3-provider';

export default function ({ keystore, contracts }) {
  const wrappedContracts = {};
  // find truffle wrappedContracts in global namespace
  const contractsArray = Object.keys(contracts).length >= 1
    ?
      Object.keys(contracts).map(k => contracts[k])
    :
      Object.keys(global)
      .map(k => global[k] && global[k].contract_name)
      .filter(k => k)
      .map(k => global[k]);

  contractsArray.forEach((contract) => {
    const hookedProvider = new HookedWeb3Provider({
      ...contract.currentProvider,
      transaction_signer: keystore,
    });
    contract.setProvider(hookedProvider);
    wrappedContracts[contract.contract_name] = contract;
  });

  return wrappedContracts;
}
