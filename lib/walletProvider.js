'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _hookedWalletEthtx = require('web3-provider-engine/subproviders/hooked-wallet-ethtx');

var _hookedWalletEthtx2 = _interopRequireDefault(_hookedWalletEthtx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SigmateSubprovider = function (_HookedWalletEthTx) {
  _inherits(SigmateSubprovider, _HookedWalletEthTx);

  function SigmateSubprovider(wallets, opts) {
    _classCallCheck(this, SigmateSubprovider);

    return _possibleConstructorReturn(this, (SigmateSubprovider.__proto__ || Object.getPrototypeOf(SigmateSubprovider)).call(this, _extends({}, opts, {
      getAccounts: function getAccounts(cb) {
        cb(null, wallets.map(function (w) {
          return w.getAddressString();
        }));
      },
      getPrivateKey: function getPrivateKey(address, cb) {
        var wallet = wallets.find(function (w) {
          return w.getAddressString() === address;
        });
        if (wallet) {
          cb(null, wallet.getPrivateKey());
        } else {
          cb('Account not found');
        }
      }
    })));
  }

  return SigmateSubprovider;
}(_hookedWalletEthtx2.default);

exports.default = SigmateSubprovider;