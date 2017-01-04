'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (config) {
  var rpcUrl = config.rpcUrl,
      keystore = config.keystore,
      virtual = config.virtual,
      prefund = config.prefund,
      rest = _objectWithoutProperties(config, ['rpcUrl', 'keystore', 'virtual', 'prefund']);

  if (!keystore || !rpcUrl) {
    throw new Error('Provider URL not set');
  }

  var _engine = (0, _engine3.default)({ rpcUrl: rpcUrl, keystore: keystore }),
      providerEngine = _engine.providerEngine,
      coinbase = _engine.coinbase;

  return _extends({}, rest, {
    from: coinbase,
    provider: providerEngine
  });
};

var _engine2 = require('./engine');

var _engine3 = _interopRequireDefault(_engine2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }