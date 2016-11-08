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

  // get correct web3 instance
  var web3 = opts.web3 || opts.deployer && opts.deployer.known_contracts[Object.keys(opts.deployer.known_contracts)[0]].web3;
  // initialize accounts
  return new _keystore2.default(_extends({}, opts, { web3: web3 })).then(function (res) {
    // skip if fundAccounts not set
    if (!opts.prefund) {
      return res;
    }
    // transfer the balances
    return new _balances2.default(_extends({}, opts, res, { web3: web3 }));
  }).then(function (res) {
    var newWeb3 = new _web2.default(_extends({}, res, { web3: web3 }));
    // get correct contracts
    var knownContracts = opts.deployer && opts.deployer.known_contracts;
    var passedContracts = _extends({}, opts.contracts, knownContracts);
    var contracts = new _contracts2.default(_extends({}, res, { contracts: passedContracts }));
    var keystore = res.keystore;
    var accounts = res.accounts;
    var users = res.users;

    return { web3: newWeb3, keystore: keystore, accounts: accounts, contracts: contracts, users: users };
  });
}