#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _keystore = require('./keystore');

var _keystore2 = _interopRequireDefault(_keystore);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _expose = require('./expose');

var _expose2 = _interopRequireDefault(_expose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var command = args._[0];

var sigmate = { keystore: _keystore2.default, list: _list2.default, expose: _expose2.default };

if (sigmate[command]) {
  sigmate[command](args);
} else {
  var pkgPath = _path2.default.join(__dirname, '../../package.json');

  var _JSON$parse = JSON.parse(_fs2.default.readFileSync(pkgPath).toString()),
      version = _JSON$parse.version;

  process.stdout.write('\nSigmate v' + version + '\n\nUsage:\n\n$ sigmate [command]\n\nCommands:\n\nkeystore     Create a new keystore\nlist         List existing keystores\nexpose       (Dangerous!) Show the Seed Phrase and Private Keys for a keystore\n\nOptional Flags:\n\n--label      Unique name for keystore\n--password   Decryption key for wallets\n--accounts   Number of wallets to create in keystore\n--path       Keystores location\n--hdPath     HD path String\n\n');
}