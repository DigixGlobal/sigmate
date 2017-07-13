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

var _ethLightwallet = require('eth-lightwallet');

var _ethLightwallet2 = _interopRequireDefault(_ethLightwallet);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function populateArgs(_ref) {
  var label = _ref.label,
      password = _ref.password,
      _ref$path = _ref.path,
      path = _ref$path === undefined ? _constants.DEFAULT_PATH : _ref$path;

  return new Promise(function (resolve, reject) {
    var requiredParams = [];
    process.stdout.write('\n⚠️  DANGER: You are about to print Seed and Private Keys!\n\n');
    if (label && password) {
      resolve({ label: label, password: password, path: path });
    }
    if (!label) {
      requiredParams.push({
        name: 'label',
        required: true,
        pattern: /^[0-9a-zA-Z-]+$/,
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
    _prompt2.default.start();
    return _prompt2.default.get(requiredParams, function (err, res) {
      if (err) {
        return reject(err);
      }
      return resolve(_extends({ label: label, password: password, path: path }, res));
    });
  });
}

function generateKeystore(_ref2) {
  var label = _ref2.label,
      path = _ref2.path,
      password = _ref2.password;

  var dest = path + '/' + _constants.PREFIX + label + '.json';
  // throw if it already exists
  if (!_fs2.default.existsSync(dest)) {
    throw new Error('Path does not exist: ' + dest);
  }
  // generate mnemonic if required
  var ks = _ethLightwallet2.default.keystore.deserialize(_fs2.default.readFileSync(dest));

  ks.keyFromPassword(password, function (err, pwDerivedKey) {
    if (err) throw err;
    var seed = ks.getSeed(pwDerivedKey);
    process.stdout.write('\nPrivate key information for: ' + dest + '\n');
    process.stdout.write('\nSeed Mnemonic:\n' + seed + '\n\n');
    // generate new address/private key pairs
    ks.getAddresses().forEach(function (a) {
      var privateKey = ks.exportPrivateKey(a, pwDerivedKey);
      process.stdout.write('Address:     ' + a + '\nPrivate Key: ' + privateKey + '\n\n');
    });
  });
}