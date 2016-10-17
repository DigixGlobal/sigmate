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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Sigmate(opts, optionalLabel) {
  // resolve label for keystore
  var label = optionalLabel || opts && opts.label;
  // map shorthand account names to object
  var accountOptions = opts.accounts || opts.reduce(function (acc, name) {
    return _extends({}, acc, _defineProperty({}, name, true));
  }, {});
  // initialize accounts
  return new _keystore2.default({
    label: label,
    accounts: accountOptions
  }).then(function (res) {
    // skip if fundAccounts not set
    if (!opts.fundAccounts) {
      return res;
    }
    if (!opts.web3) {
      throw Error('web3 must be set if you wish to fund accounts');
    }
    return new Promise(function (resolve) {
      return new _balances2.default({
        accountOptions: accountOptions,
        web3: opts.web3,
        defaultAmount: opts.fundAccounts,
        accounts: res.accounts
      }).then(function (accounts) {
        return resolve(_extends({}, res, { accounts: accounts }));
      });
    });
  }).then(function (_ref) {
    var keystore = _ref.keystore;
    var accounts = _ref.accounts;

    var web3 = new _web2.default({ keystore: keystore, web3: opts.web3 });
    var contracts = new _contracts2.default({ keystore: keystore });
    return { web3: web3, keystore: keystore, accounts: accounts, contracts: contracts };
  });
}