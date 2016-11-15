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
  _fs2.default.readdirSync(path).forEach(function (label) {
    var dir = path + '/' + label;
    if (!_fs2.default.lstatSync(dir).isDirectory()) {
      return;
    }
    var keys = _fs2.default.readdirSync(dir);
    process.stdout.write('\n' + label + ' [' + keys.length + ']\n');
    keys.forEach(function (key) {
      var address = key.split('-').pop();
      process.stdout.write(address + '\n');
    });
  });
  process.stdout.write('\n');
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }