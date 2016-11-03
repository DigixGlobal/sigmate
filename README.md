# Sigmate

### A tool to simplify running tests with multiple Ethereum Accounts

This package is designed for use with [truffle](https://github.com/ConsenSys/truffle), and support ES6 projects.

The problem: writing a test suite is great with TestRPC, but it gets trickier when trying to run the same suite against different chains, with potentially different accounts and balances.

Sigmate simplifies testing Ethereum contracts by using a local keystore to sign transactions. It's essentially a lightwallet specifically for testing within multiple different environments.

When you initialise Sigmate, you pass it some unique account names. These accounts will be automatically funded with Ether from the chain's default account, and web3 will be hooked to use these accounts instead of the default chain accounts.

Sigmate is environment-agnostic, but will share keys across multiple chains. Ensure you initialise Sigmate with the correct balances for the chain you are working on.

## Usage

`npm install @digix/sigmate`

```javascript
import Sigmate from '@digix/sigmate'

// full options; generate accounts + web3 provider + wrapped contracts (in truffle environment)
new Sigmate({
  count: 5, // optional, set number of accounts to create / fund
  prefund: 1e18 * 0.5 // optional, set default funding amount for all accounts
  web3: web3, // optional, pass web3 instance to be wrapped and returned
  // TODO password: '', // optional, set a password to use for the keystore
  label: 'myProject', // optional, provide a label to save the keystore, will be re-used between instantiations
}).then((sigmate) => {  
  sigmate.web3 // wrapped web3 provider, see below 'Web3 Provider'
  sigmate.accounts // returns accounts info, see below 'Sigmate Accounts'
  sigmate.contracts // return wrapped contracts, see below 'Contract Interaction'
});
```

## Web3 Provider

Sigmate will return a web3 provider that's ready to sign transactions from the accounts you provided earlier. It will automatically sign transactions with the given account without requiring a password.

```javascript
const { web3, accounts } = sigmate;
web3.accounts // Lists accounts on connected node, NOT Sigmate accounts
accounts // lists sigmate accounts
web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], value: 10000000 });
```

## Contract Interaction

If you provide a `contracts` option (the `global` environment within a truffle `it` test block), Sigmate will automatically replace the `from` field with a given address if you provide the account name instead of it's address.

## Tests

`npm run test`

## License

MIT 2016
