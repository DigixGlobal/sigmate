import engine from './engine';

export default function (config) {
  const newConfig = { ...config };
  if (!config.networks) { throw new Error('Must have a `networks` field set in config'); }
  Object.keys(config.networks).forEach((key) => {
    const network = config.networks[key];
    if (network.keystore) {
      if (!network.providerUrl) { throw new Error('Provider URL not set'); }
      const { providerEngine, coinbase } = engine(network);
      network.provider = providerEngine;
      network.from = coinbase;
    }
    newConfig.networks[key] = network;
  });
  return newConfig;
}
