'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var keystore = _ref.keystore;
  var contracts = _ref.contracts;

  var wrappedContracts = {};
  // find truffle wrappedContracts in global namespace
  var contractsArray = contracts ? Object.keys(contracts).map(function (k) {
    return contracts[k];
  }) : Object.keys(global).map(function (k) {
    return global[k] && global[k].contract_name;
  }).filter(function (k) {
    return k;
  }).map(function (k) {
    return global[k];
  });

  contractsArray.forEach(function (contract) {
    var hookedProvider = new _hookedWeb3Provider2.default(_extends({}, contract.currentProvider, {
      transaction_signer: keystore
    }));
    contract.setProvider(hookedProvider);
    wrappedContracts[contract.contract_name] = contract;
  });

  return wrappedContracts;
};

var _hookedWeb3Provider = require('hooked-web3-provider');

var _hookedWeb3Provider2 = _interopRequireDefault(_hookedWeb3Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }