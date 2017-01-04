'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (config) {
  var newConfig = _extends({}, config);
  if (!config.networks) {
    throw new Error('Must have a `networks` field set in config');
  }
  Object.keys(config.networks).forEach(function (key) {
    var network = config.networks[key];
    if (network.keystore) {
      if (!network.providerUrl) {
        throw new Error('Provider URL not set');
      }

      var _engine = (0, _engine3.default)(network),
          providerEngine = _engine.providerEngine,
          coinbase = _engine.coinbase;

      network.provider = providerEngine;
      network.from = coinbase;
    }
    newConfig.networks[key] = network;
  });
  return newConfig;
};

var _engine2 = require('./engine');

var _engine3 = _interopRequireDefault(_engine2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }