import engine from './engine';

export default function (config) {
  const { rpcUrl, keystore, virtual, prefund, ...rest } = config;
  const { providerEngine, coinbase } = engine({ rpcUrl, keystore, virtual, prefund });
  return {
    ...rest,
    from: coinbase,
    provider: providerEngine,
  };
}
