# Sigmate v2

### Rationale

[This](https://github.com/ConsenSys/example-truffle-library/blob/master/truffle.js).

The beta version of truffle (3.0) includes built in support for npm-published contracts. For sigmate to work nicely with this, a rewrite is required to change it's functionality.

* This version will have a new, truffle-specific API
* Support keystores
* Use web3-provider-engine instead of hooked-web3-provider
* Use etheruemjs-wallet instead of eth-lightwallet
* Reintroduce the command line options from `sigma`
* Support for in-memory testrpc provider
* Automatically set the `from` address to keystore's `0` account

### WIP API

```javascript
module.exports = sigmate.truffle({
  networks: {
    live: {
      network_id: 1,
    },
    morden: { // pass to sigmate.engine
      network_id: 2,
      providerUrl: 'http://morden.infura.io:8545',
      keystore: {
        path: '~/.simgate' // optional keystores path
        label: 'digix-deployer',
        password: process.env.KS_PASS,
      }
    },
    digixTestnet: {
      network_id: 1337,
      providerUrl: 'http://172.39.1.1:8545',
    },
    development: {
      network_id: 'default',
      testRpcProvider: true, // in-memory rpc provider
    },
  },
  // merge with config to allow all other params
});
```

Non-truffle use

```javascript
import sigmate from '@digix/sigmate';

web3 = sigmate.engine({  // config options as above
  providerUrl: 'http://modren',
  keystore: {
    ...
  },
})
```

Command Line Utility

```bash
# saves keystore in ~/.sigmate/
$ sigmate keystore
enter keystore label: ...
enter keystore password: ...
# or sitmate keystore --label blah --password blah --path ~/.sigmate

# lists ~/.sigmate/ keystores
$ sigmate list
```
