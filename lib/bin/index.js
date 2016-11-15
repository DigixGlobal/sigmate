'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _keystore = require('./keystore');

var _keystore2 = _interopRequireDefault(_keystore);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// parse inputs
var args = (0, _minimist2.default)(process.argv.slice(2));
var commands = { keystore: _keystore2.default, list: _list2.default };
var command = args._[0];

if (!commands[command]) {
  throw new Error('Command \'' + command + '\' not available');
  // TODO show the available commands
}

commands[command](args);