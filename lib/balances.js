'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var web3 = _ref.web3;
  var defaultAmount = _ref.defaultAmount;
  var accounts = _ref.accounts;
  var accountOptions = _ref.accountOptions;

  var accountsWithBalances = _extends({}, accounts);
  // send some ether to the accounts...
  return Promise.all(Object.keys(accounts).map(function (name) {
    return new Promise(function (resolve) {
      var amount = isNaN(accountOptions[name].balance) ? defaultAmount : accountOptions[name].balance;
      var address = accounts[name].address;
      accountsWithBalances[name].minimumFunding = amount;
      // check to see the balance of the current account
      return web3.eth.getBalance(address, function (err1, initialBalance) {
        // determine how much we need to send...
        var amountToSend = amount - initialBalance.toNumber();
        if (amountToSend <= 0) {
          accountsWithBalances[name].initialBalance = initialBalance.toNumber();
          return resolve();
        }
        process.stdout.write('Funding account ' + name + ' with ' + amount + ' wei...\n');
        return web3.eth.getAccounts(function (err, nodeAccounts) {
          return web3.eth.sendTransaction({ from: nodeAccounts[0], to: address, value: amountToSend }, null, function (err2, txHash) {
            var filter = web3.eth.filter('latest');
            filter.watch(function () {
              // to get the async library out...
              web3.eth.getTransactionReceipt(txHash, function (err3, receipt) {
                if (receipt && receipt.transactionHash === txHash) {
                  filter.stopWatching(function () {
                    return web3.eth.getBalance(address, function (err4, fundedBalance) {
                      accountsWithBalances[name].initialBalance = fundedBalance.toNumber();
                      resolve();
                    });
                  });
                }
                return null;
              });
            });
          });
        });
      });
    });
  })).then(function () {
    return accountsWithBalances;
  });
};