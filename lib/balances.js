'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncIterator = asyncIterator;

exports.default = function (opts) {
  var accounts = opts.accounts;
  var web3 = opts.web3;
  var prefund = opts.prefund;

  return new Promise(function (resolve) {
    asyncIterator(accounts, function (address, done) {
      // check to see the balance of the current account
      return web3.eth.getBalance(address, function (err1, initialBalance) {
        // determine how much we need to send...
        var amountToSend = prefund - initialBalance.toNumber();
        if (amountToSend <= 0) {
          return done();
        }
        process.stdout.write('Funding account ' + address + ' with ' + amountToSend + ' additional wei...\n');
        return web3.eth.getAccounts(function (err, nodeAccounts) {
          return web3.eth.sendTransaction({ from: nodeAccounts[0], to: address, value: amountToSend }, null, function (err2, txHash) {
            var filter = web3.eth.filter('latest');
            filter.watch(function () {
              // to get the async library out...
              web3.eth.getTransactionReceipt(txHash, function (err3, receipt) {
                if (receipt && receipt.transactionHash === txHash) {
                  filter.stopWatching();
                  done();
                }
                return null;
              });
            });
          });
        });
      });
    }, function () {
      return resolve(opts);
    });
  });
};

function asyncIterator(data, fn, done) {
  var i = 0;
  function iterate() {
    fn(data[i], function () {
      i++;
      if (i > data.length - 1) {
        done();
      } else {
        iterate();
      }
    });
  }
  iterate();
}

// update this in a bit...