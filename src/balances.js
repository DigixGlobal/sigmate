export default function ({ web3, defaultAmount, accounts, accountOptions }) {
  const accountsWithBalances = { ...accounts };
  // send some ether to the accounts...
  return Promise.all(Object.keys(accounts).map((name) => {
    return new Promise((resolve) => {
      const amount = isNaN(accountOptions[name].balance) ? defaultAmount : accountOptions[name].balance;
      const address = accounts[name].address;
      accountsWithBalances[name].minimumFunding = amount;
      // check to see the balance of the current account
      return web3.eth.getBalance(address, (err1, initialBalance) => {
        // determine how much we need to send...
        const amountToSend = amount - initialBalance.toNumber();
        if (amountToSend <= 0) {
          accountsWithBalances[name].initialBalance = initialBalance.toNumber();
          return resolve();
        }
        process.stdout.write(`Funding account ${name} with ${amount} wei...\n`);
        return web3.eth.getAccounts((err, nodeAccounts) => {
          return web3.eth.sendTransaction({ from: nodeAccounts[0], to: address, value: amountToSend }, null, (err2, txHash) => {
            const filter = web3.eth.filter('latest');
            filter.watch(() => {
              // to get the async library out...
              web3.eth.getTransactionReceipt(txHash, (err3, receipt) => {
                if (receipt && receipt.transactionHash === txHash) {
                  filter.stopWatching(() => {
                    return web3.eth.getBalance(address, (err4, fundedBalance) => {
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
  })).then(() => accountsWithBalances);
}
