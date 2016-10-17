'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var keystore = _ref.keystore;

  var contracts = {};
  // find truffle contracts in global namespace
  Object.keys(global).forEach(function (key) {
    if (global[key] && global[key].contract_name) {
      // clone the global
      var contract = _extends({}, global[key]);
      // create the provider for web3 transactions using ks
      var hookedProvider = new _hookedWeb3Provider2.default(_extends({}, contract.currentProvider, {
        transaction_signer: keystore
      }));
      contract.setProvider(hookedProvider);
      contracts[key] = contract;
    }
  });
  return contracts;
};

var _hookedWeb3Provider = require('hooked-web3-provider');

var _hookedWeb3Provider2 = _interopRequireDefault(_hookedWeb3Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }