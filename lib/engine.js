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

  // defaults
  providerEngine.addProvider(new _defaultFixture2.default());
  providerEngine.addProvider(new _nonceTracker2.default());
  providerEngine.addProvider(new _sanitizer2.default());
  providerEngine.addProvider(new _cache2.default());
  providerEngine.addProvider(new _filters2.default());

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
      providerEngine.addProvider(new _subprovider2.default(wallets));
    })();
  }

  if (rpcUrl && virtual) {
    throw new Error('Specify `rpcUrl` or `virtual` - not both');
  }

  if (virtual) {
    console.log('adding Testrpc provider....');
    providerEngine.addProvider(_ethereumjsTestrpc2.default.provider());
  }

  if (rpcUrl) {
    var rpcSubprovider = new _rpc2.default({ rpcUrl: rpcUrl });
    // TODO additional logging
    // const oldHandler = rpcSubprovider.handleRequest;
    // rpcSubprovider.handleRequest = (...args) => {
    //   console.log('handling', args);
    //   return oldHandler.apply(rpcSubprovider, args);
    // }
    // providerEngine.on('error', err => console.log('err', err.stack));
    providerEngine.addProvider(rpcSubprovider);
  }

  providerEngine.start();

  // TODO prefund!
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

var _defaultFixture = require('web3-provider-engine/subproviders/default-fixture');

var _defaultFixture2 = _interopRequireDefault(_defaultFixture);

var _nonceTracker = require('web3-provider-engine/subproviders/nonce-tracker');

var _nonceTracker2 = _interopRequireDefault(_nonceTracker);

var _sanitizer = require('web3-provider-engine/subproviders/sanitizer');

var _sanitizer2 = _interopRequireDefault(_sanitizer);

var _cache = require('web3-provider-engine/subproviders/cache');

var _cache2 = _interopRequireDefault(_cache);

var _filters = require('web3-provider-engine/subproviders/filters');

var _filters2 = _interopRequireDefault(_filters);

var _rpc = require('web3-provider-engine/subproviders/rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _ethereumjsTestrpc = require('ethereumjs-testrpc');

var _ethereumjsTestrpc2 = _interopRequireDefault(_ethereumjsTestrpc);

var _subprovider = require('./subprovider');

var _subprovider2 = _interopRequireDefault(_subprovider);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }