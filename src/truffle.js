import Web3Subprovider from 'web3-provider-engine/subproviders/web3';
import Web3 from 'web3';

import engine from './engine';

export default function (config) {
  if (!config.networks) { throw new Error('Must have a `networks` field set in config'); }
  Object.keys(config.networks).forEach((key) => {
    const network = config.networks[key];
    if (network.keystore) {
      if (!network.providerUrl) { throw new Error('Provider URL not set'); }
      const { providerEngine, coinbase } = engine(network.keystore);
      // TODO testrpc provider instaed of http
      const httpProvider = new Web3.providers.HttpProvider(network.providerUrl);
      providerEngine.addProvider(new Web3Subprovider(httpProvider));
      providerEngine.start(providerEngine);
      network.provider = providerEngine;
      network.from = coinbase;
    }
    config.networks[key] = network;
  });
  return config;
}
