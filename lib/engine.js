'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var _ref$path = _ref.path,
      path = _ref$path === undefined ? _constants.DEFAULT_PATH : _ref$path,
      label = _ref.label,
      password = _ref.password;

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

  var wallets = _fs2.default.readdirSync(dest).map(function (file) {
    try {
      return _ethereumjsWallet2.default.fromV3(_fs2.default.readFileSync(dest + '/' + file).toString(), password);
    } catch (e) {
      return null;
    }
  }).filter(function (w) {
    return w;
  });

  var providerEngine = new _web3ProviderEngine2.default();
  providerEngine.addProvider(new _subprovider2.default(wallets));
  return {
    providerEngine: providerEngine,
    coinbase: wallets[0].getAddressString()
  };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ethereumjsWallet = require('ethereumjs-wallet');

var _ethereumjsWallet2 = _interopRequireDefault(_ethereumjsWallet);

var _web3ProviderEngine = require('web3-provider-engine');

var _web3ProviderEngine2 = _interopRequireDefault(_web3ProviderEngine);

var _subprovider = require('./subprovider');

var _subprovider2 = _interopRequireDefault(_subprovider);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }