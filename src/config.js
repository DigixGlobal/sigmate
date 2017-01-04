import engine from './engine';

export default function (config) {
  const { rpcUrl, keystore, virtual, prefund, ...rest } = config;
  if (!keystore || !rpcUrl) { throw new Error('Provider URL not set'); }
  const { providerEngine, coinbase } = engine({ rpcUrl, keystore });
  return {
    ...rest,
    from: coinbase,
    provider: providerEngine,
  };
}
