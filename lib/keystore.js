'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref2) {
  var _ref2$count = _ref2.count;
  var count = _ref2$count === undefined ? 5 : _ref2$count;
  var label = _ref2.label;

  // if no label is supplied, we create a temporary keystore
  // if there is a label, read/save to the saved label's keystore
  return new Promise(function (resolve) {
    // try to read the keystore if there is a label
    var readKs = label && readKeystore(label);
    // resolve promise if we have it
    if (readKs) {
      return resolve(readKs);
    }
    // keystore doesn't exist, we need to create it.
    return createKeystore().then(resolve);
  }).then(function (ks) {
    // get the key from the keystore for later use
    return new Promise(function (resolve) {
      // get the pwDerivedKey
      ks.keyFromPassword(_constants.PASSWORD, function (err, pwDerivedKey) {
        resolve({ ks: ks, pwDerivedKey: pwDerivedKey });
      });
    });
  }).then(function (_ref3) {
    var ks = _ref3.ks;
    var pwDerivedKey = _ref3.pwDerivedKey;

    // count number of addresses that already exist
    var existingAddresses = ks.getAddresses();
    // check if we need to generate new ones
    if (existingAddresses.length < count) {
      // generat the reuqired number of new addresses
      ks.generateNewAddress(pwDerivedKey, count - existingAddresses.length);
      // save the keystore if we have generated new addresses
      if (label) {
        writeKeystore({ ks: ks, label: label });
      }
    }
    // get the new address list, trim it to the number requested
    var accounts = ks.getAddresses().slice(0, count).map(function (a) {
      return '0x' + a;
    });
    // make the password provider always sign with the default apssword
    ks.passwordProvider = function provider(callback) {
      callback(null, _constants.PASSWORD);
    };
    // return the keystore and the count with accounts
    return { keystore: ks, accounts: accounts };
  });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ethLightwallet = require('eth-lightwallet');

var _ethLightwallet2 = _interopRequireDefault(_ethLightwallet);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getKeystoreFilename(label) {
  if (!label) {
    return false;
  }
  var filename = 'sigmate-keystore-' + label + '.json';
  return _constants.VAULT_DIRECTORY + '/' + filename;
} /* eslint-disable no-param-reassign */

function writeKeystore(_ref) {
  var label = _ref.label;
  var ks = _ref.ks;

  // create a vault directory if one doesn't exist
  if (!_fs2.default.existsSync(_constants.VAULT_DIRECTORY)) {
    _fs2.default.mkdirSync(_constants.VAULT_DIRECTORY);
  }
  // get JSON formatted data
  var serialized = ks.serialize();
  // write the file
  return _fs2.default.writeFileSync(getKeystoreFilename(label), serialized);
}

function readKeystore(label) {
  var ksFilename = getKeystoreFilename(label);
  if (!ksFilename || !_fs2.default.existsSync(ksFilename)) {
    return false;
  }
  var jsonData = _fs2.default.readFileSync(ksFilename, 'utf8');
  return _ethLightwallet2.default.keystore.deserialize(jsonData);
}

function createKeystore() {
  return new Promise(function (resolve) {
    _ethLightwallet2.default.keystore.createVault({ password: _constants.PASSWORD }, function (err, ks) {
      resolve(ks);
    });
  });
}