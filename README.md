# Sigmate

### A tool to simplify running tests with multiple Ethereum Accounts

The problem: writing a test suite is great with TestRPC, but it gets trickier when trying to run the same suite against different chains, with potentially different accounts and balances.

Sigmate simplifies testing Ethereum contracts by using a local keystore to sign transactions. It's essentially a lightwallet specifically for testing within multiple different environments.

When you initialise Sigmate, you pass it some unique account names. These accounts will be funded with Ether from the chain's default account, and web3 will be hooked to use these accounts instead of the default chain accounts.

Sigmate is environment-agnostic, but will share keys across multiple chains. Ensure you initialise Sigmate with the correct balances for the chain you are working on.

## Usage

```javascript
// shorthand; generate accounts + web3 provider
const sigmate = new Sigmate(['primary', 'secondary'], 'label'); // label is optional, namespaces to a given project

// full options; generate accounts + web3 provider + wrapped contracts (in truffle environment)
const sigmate = new Sigmate({
  accounts: { // pass array of strings or object
    'primary': { balance: 1e18 }, // funds account with ether value
    'secondary': true, // defaults to `defaultBalance` if not set
    'tertiary': { balance 0 },
  },
  defaultBalance: 1e18 * 0.5 // default 1e18 (1 ether), set default funding for all accounts
  contracts: true, // default true, detect + wrap truffle contracts
  cache: true, // default true, re-use account keys between deploys (globally!)
  provider: web3, // optional, pass web3 instance to be wrapped
  host: 'http://localhost:8545', // optional, create or update web3 with the host
  label: 'myProject', // optional, provide a label for the keystore, for re-usability
  seed: 'xyz', // optional, provide a HD seed for generating accounts
});

sigmate.accounts // returns accounts info, see below 'Sigmate Accounts'
sigmate.web3 // wrapped web3 provider, see below 'Web3 Provider'
sigmate.contracts // return wrapped contracts, see below 'Contract Interaction'
```

## Sigmate Accounts

```javascript
{
  primary: {
    address: '0x1234...cdef',
    privateKey: '...',
    // TODO
  },
  secondary: { /* ... */ }
  // ...
}
```

## Web3 Provider

Sigmate will return a web3 provider that's ready to sign transactions from the accounts you provided earlier. It will automatically sign transactions with the given account without requiring a password.

```javascript
const { web3 } = sigmate;
web3.accounts // Lists accounts on connected node, NOT Sigmate accounts
web3.eth.sendTransaction({ from: 'primary', to: 'secondary', value: 10000000 });
```

## Contract Interaction

If you provide a `contracts` option (the `global` environment within a truffle `it` test block), Sigmate will automatically replace the `from` field with a given address if you provide the account name instead of it's address.

```javascript
const myContract = sigmate.contracts.MyContract.deployed();
// using truffle's ether-pudding syntax
myContract.someMethod(1234, { from: 'secondary' }).then( /* .... */ )
// equivalent to
myContract.someMethod(1234, { from: sigmate.accounts.secondary.address }).then( /* .... */ )
```
