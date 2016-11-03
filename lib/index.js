'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // main entrypoint


exports.default = Sigmate;

var _keystore = require('./keystore');

var _keystore2 = _interopRequireDefault(_keystore);

var _balances = require('./balances');

var _balances2 = _interopRequireDefault(_balances);

var _web = require('./web3');

var _web2 = _interopRequireDefault(_web);

var _contracts = require('./contracts');

var _contracts2 = _interopRequireDefault(_contracts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Sigmate() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // initialize accounts
  return new _keystore2.default(opts).then(function (res) {
    // skip if fundAccounts not set
    if (!opts.prefund) {
      return res;
    }
    // transfer balance
    return new _balances2.default(_extends({}, opts, res));
  }).then(function (res) {
    var web3 = new _web2.default(res);
    var contracts = new _contracts2.default(res);
    var keystore = res.keystore;
    var accounts = res.accounts;

    return { web3: web3, keystore: keystore, accounts: accounts, contracts: contracts };
  });
}