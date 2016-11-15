'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  if (!config.networks) {
    throw new Error('Must have a `networks` field set in config');
  }
  Object.keys(config.networks).forEach(function (key) {
    var network = config.networks[key];
    if (network.keystore) {
      if (!network.providerUrl) {
        throw new Error('Provider URL not set');
      }

      var _engine = (0, _engine3.default)(network.keystore),
          providerEngine = _engine.providerEngine,
          coinbase = _engine.coinbase;
      // TODO testrpc provider instaed of http


      var httpProvider = new _web4.default.providers.HttpProvider(network.providerUrl);
      providerEngine.addProvider(new _web2.default(httpProvider));
      providerEngine.start(providerEngine);
      network.provider = providerEngine;
      network.from = coinbase;
    }
    config.networks[key] = network;
  });
  return config;
};

var _web = require('web3-provider-engine/subproviders/web3');

var _web2 = _interopRequireDefault(_web);

var _web3 = require('web3');

var _web4 = _interopRequireDefault(_web3);

var _engine2 = require('./engine');

var _engine3 = _interopRequireDefault(_engine2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }