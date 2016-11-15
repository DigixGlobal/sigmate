'use strict';

/* eslint-disable no-underscore-dangle */
var HookedWalletEthTx = require('web3-provider-engine/subproviders/hooked-wallet-ethtx');
var inherits = require('util').inherits;

function SigmateSubprovider(wallets, _opts) {
  var opts = _opts || {};
  opts.getAccounts = function (cb) {
    cb(null, wallets.map(function (w) {
      return w.getAddressString();
    }));
  };
  opts.getPrivateKey = function (address, cb) {
    var wallet = wallets.find(function (w) {
      return w.getAddressString() === address;
    });
    if (!wallet) {
      return cb('Account not found');
    }
    return cb(null, wallet.getPrivateKey());
  };

  SigmateSubprovider.super_.call(this, opts);
}
inherits(SigmateSubprovider, HookedWalletEthTx);

module.exports = SigmateSubprovider;