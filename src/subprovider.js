/* eslint-disable no-underscore-dangle */
const HookedWalletEthTx = require('web3-provider-engine/subproviders/hooked-wallet-ethtx');
const inherits = require('util').inherits;

function SigmateSubprovider(wallets, _opts) {
  const opts = _opts || {};
  opts.getAccounts = (cb) => {
    cb(null, wallets.map(w => w.getAddressString()));
  };
  opts.getPrivateKey = (address, cb) => {
    const wallet = wallets.find(w => w.getAddressString() === address);
    if (!wallet) {
      return cb('Account not found');
    }
    return cb(null, wallet.getPrivateKey());
  };

  SigmateSubprovider.super_.call(this, opts);
}
inherits(SigmateSubprovider, HookedWalletEthTx);

module.exports = SigmateSubprovider;
