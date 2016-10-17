'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var keystore = _ref.keystore;
  var web3 = _ref.web3;

  // get or instantiate the web3
  var newWeb3 = web3 || global.web3 || new _web2.default();
  // create the provider for web3 transactions using ks
  var hookedProvider = new _hookedWeb3Provider2.default(_extends({}, newWeb3.currentProvider, {
    transaction_signer: keystore
  }));
  // update the web3 instance to use our new provider
  newWeb3.setProvider(hookedProvider);
  // return the updated provider
  return newWeb3;
};

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _hookedWeb3Provider = require('hooked-web3-provider');

var _hookedWeb3Provider2 = _interopRequireDefault(_hookedWeb3Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }