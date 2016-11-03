export function asyncIterator(data, fn, done) {
  let i = 0;
  function iterate() {
    fn(data[i], () => {
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
export default function (opts) {
  const { accounts, web3, prefund } = opts;
  return new Promise((resolve) => {
    asyncIterator(accounts, (address, done) => {
      // check to see the balance of the current account
      return web3.eth.getBalance(address, (err1, initialBalance) => {
        // determine how much we need to send...
        const amountToSend = prefund - initialBalance.toNumber();
        if (amountToSend <= 0) {
          return done();
        }
        process.stdout.write(`Funding account ${address} with ${amountToSend} additional wei...\n`);
        return web3.eth.getAccounts((err, nodeAccounts) => {
          return web3.eth.sendTransaction({ from: nodeAccounts[0], to: address, value: amountToSend }, null, (err2, txHash) => {
            const filter = web3.eth.filter('latest');
            filter.watch(() => {
              // to get the async library out...
              web3.eth.getTransactionReceipt(txHash, (err3, receipt) => {
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
    }, () => resolve(opts));
  });
}
