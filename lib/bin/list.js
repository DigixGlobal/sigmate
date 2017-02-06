'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var _ref$path = _ref.path,
      path = _ref$path === undefined ? _constants.DEFAULT_PATH : _ref$path;

  if (!_fs2.default.existsSync(path)) {
    process.stdout.write('path not found: ' + path + '\n');
    process.exit();
  }
  _fs2.default.readdirSync(path).filter(function (str) {
    return str.indexOf(_constants.PREFIX) === 0;
  }).forEach(function (label) {
    var filename = path + '/' + label;
    var serialized = _fs2.default.readFileSync(filename);
    var ks = _ethLightwallet2.default.keystore.deserialize(serialized);
    var addresses = ks.getAddresses();
    process.stdout.write('\n' + filename + ' [' + addresses.length + ']\n');
    addresses.forEach(function (a) {
      return process.stdout.write(a + '\n');
    });
  });
  process.stdout.write('\n');
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ethLightwallet = require('eth-lightwallet');

var _ethLightwallet2 = _interopRequireDefault(_ethLightwallet);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }