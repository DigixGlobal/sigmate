import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';

export default class SigmateSubprovider extends HookedWalletEthTx {
  constructor(wallets, opts) {
    super({
      ...opts,
      getAccounts(cb) {
        cb(null, wallets.map(w => w.getAddressString()));
      },
      getPrivateKey(address, cb) {
        const wallet = wallets.find(w => w.getAddressString() === address);
        if (wallet) {
          cb(null, wallet.getPrivateKey());
        } else {
          cb('Account not found');
        }
      },
    });
  }
}
