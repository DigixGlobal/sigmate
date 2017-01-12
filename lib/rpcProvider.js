'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rpc = require('web3-provider-engine/subproviders/rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _createPayload = require('web3-provider-engine/util/create-payload');

var _createPayload2 = _interopRequireDefault(_createPayload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var xhr = process.browser ? require('xhr') : require('request');

var SigmateSubprovider = function (_RPCProvider) {
  _inherits(SigmateSubprovider, _RPCProvider);

  function SigmateSubprovider() {
    _classCallCheck(this, SigmateSubprovider);

    return _possibleConstructorReturn(this, (SigmateSubprovider.__proto__ || Object.getPrototypeOf(SigmateSubprovider)).apply(this, arguments));
  }

  _createClass(SigmateSubprovider, [{
    key: 'handleRequest',
    value: function handleRequest(payload, next, end) {
      var self = this;
      var targetUrl = self.rpcUrl;
      var method = payload.method;

      // new payload with random large id,
      // so as not to conflict with other concurrent users
      var newPayload = (0, _createPayload2.default)(payload);

      // console.log('------------------ network attempt -----------------')
      // console.log(payload)
      // console.log('---------------------------------------------')

      xhr({
        uri: targetUrl,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPayload),
        rejectUnauthorized: false
      }, function (err, res, body) {
        if (err) {
          console.log(err);
        }
        if (err) return end(err);
        if (res.statusCode !== 200) {
          var message = 'HTTP Error: ' + res.statusCode + ' on ' + method;
          console.log(message);
          return end(new Error(message));
        }
        // parse response into raw account
        var data = void 0;
        try {
          data = JSON.parse(body);
          if (data.error) {
            console.log(data.error);
          }
          if (data.error) return end(data.error);
        } catch (err2) {
          console.error(err.stack);
          return end(err2);
        }
        // console.log('network:', payload.method, payload.params, '->', data.result);
        return end(null, data.result);
      });
    }
  }]);

  return SigmateSubprovider;
}(_rpc2.default);

exports.default = SigmateSubprovider;