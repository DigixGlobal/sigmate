'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var keystore = _ref.keystore,
      rpcUrl = _ref.rpcUrl,
      virtual = _ref.virtual,
      prefund = _ref.prefund;


  var providerEngine = new _web3ProviderEngine2.default();

  var wallets = void 0;

  if (keystore) {
    (function () {
      var _keystore$path = keystore.path,
          path = _keystore$path === undefined ? _constants.DEFAULT_PATH : _keystore$path,
          label = keystore.label,
          password = keystore.password;

      var dest = path + '/' + label;
      if (!path) {
        throw new Error('Password not provided');
      }
      if (!label) {
        throw new Error('Keystore name not provided');
      }
      if (password === undefined) {
        throw new Error('Password not provided');
      }
      if (!_fs2.default.existsSync(dest)) {
        throw new Error('keystore not found: ' + dest);
      }
      wallets = _fs2.default.readdirSync(dest).map(function (file) {
        try {
          return _ethereumjsWallet2.default.fromV3(_fs2.default.readFileSync(dest + '/' + file).toString(), password);
        } catch (e) {
          return null;
        }
      }).filter(function (w) {
        return w;
      });
      providerEngine.addProvider(new _walletProvider2.default(wallets));
    })();
  }

  if (rpcUrl) {
    var rpcSubprovider = new _rpc2.default({ rpcUrl: rpcUrl });
    providerEngine.addProvider(rpcSubprovider);
  }

  // defaults
  providerEngine.addProvider(new _nonceTracker2.default());
  // init
  providerEngine._fetchLatestBlock();

  return {
    providerEngine: providerEngine,
    coinbase: wallets && wallets[0].getAddressString()
  };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ethereumjsWallet = require('ethereumjs-wallet');

var _ethereumjsWallet2 = _interopRequireDefault(_ethereumjsWallet);

var _web3ProviderEngine = require('web3-provider-engine');

var _web3ProviderEngine2 = _interopRequireDefault(_web3ProviderEngine);

var _nonceTracker = require('web3-provider-engine/subproviders/nonce-tracker');

var _nonceTracker2 = _interopRequireDefault(_nonceTracker);

var _rpc = require('web3-provider-engine/subproviders/rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _walletProvider = require('./walletProvider');

var _walletProvider2 = _interopRequireDefault(_walletProvider);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }