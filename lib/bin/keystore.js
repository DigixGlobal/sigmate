'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (args) {
  // show commander prompt
  return populateArgs(args).then(generateKeystore).catch(function (err) {
    process.stdout.write('\n' + err.message + '\n');
  });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _ethLightwallet = require('eth-lightwallet');

var _ethLightwallet2 = _interopRequireDefault(_ethLightwallet);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function populateArgs(_ref) {
  var label = _ref.label,
      password = _ref.password,
      mnemonic = _ref.mnemonic,
      _ref$accounts = _ref.accounts,
      accounts = _ref$accounts === undefined ? _constants.DEFAULT_ACCOUNTS : _ref$accounts,
      _ref$path = _ref.path,
      path = _ref$path === undefined ? _constants.DEFAULT_PATH : _ref$path;

  return new Promise(function (resolve, reject) {
    var requiredParams = [];
    if (label && mnemonic && password) {
      resolve({ label: label, mnemonic: mnemonic, password: password, path: path, accounts: accounts });
    }
    if (!label) {
      requiredParams.push({
        name: 'label',
        required: true,
        pattern: /^[0-9a-zA-Z\-]+$/,
        description: 'Keystore label'
      });
    }
    if (!password) {
      requiredParams.push({
        name: 'password',
        hidden: true,
        required: true,
        description: 'Decryption password'
      });
    }
    if (!accounts) {
      requiredParams.push({
        name: 'accounts',
        pattern: /^[0-9]+$/,
        description: 'Number of accounts (default ' + _constants.DEFAULT_ACCOUNTS + ')'
      });
    }
    if (!mnemonic) {
      requiredParams.push({
        name: 'mnemonic',
        description: '12 word mnemonic (optional)'
      });
    }
    _prompt2.default.start();
    return _prompt2.default.get(requiredParams, function (err, res) {
      if (err) {
        return reject(err);
      }
      return resolve(_extends({ label: label, mnemonic: mnemonic, password: password, path: path, accounts: accounts }, res));
    });
  });
}

function generateKeystore(_ref2) {
  var label = _ref2.label,
      mnemonic = _ref2.mnemonic,
      password = _ref2.password,
      path = _ref2.path,
      accounts = _ref2.accounts;

  var dest = path + '/' + _constants.PREFIX + label + '.json';
  // create dest if it doesn't exist
  if (!_fs2.default.existsSync(path)) {
    _fs2.default.mkdirSync(path);
  }
  // throw if it already exists
  if (_fs2.default.existsSync(dest)) {
    throw new Error('canceled - label is already in use: ' + dest);
  }
  // generate mnemonic if required
  var seedPhrase = mnemonic;
  if (!mnemonic) {
    // TODO entropy, etc.
    seedPhrase = _bip2.default.generateMnemonic();
    process.stdout.write('\nGenerated seed mnemonic:\n' + seedPhrase + '\n');
  }
  _ethLightwallet2.default.keystore.createVault({
    password: password,
    seedPhrase: seedPhrase
  }, function (err, ks) {
    process.stdout.write('\nGeneratied ' + accounts + ' accounts:\n');
    ks.keyFromPassword(password, function (err2, pwDerivedKey) {
      if (err2) throw err;
      // generate new address/private key pairs
      ks.generateNewAddress(pwDerivedKey, accounts);
      ks.getAddresses().forEach(function (a) {
        return process.stdout.write(a + '\n');
      });
      // save the keystore
      _fs2.default.writeFileSync(dest, ks.serialize());
      process.stdout.write('\nSaved keystore:\n' + dest + '\n');
    });
  });
}