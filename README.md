# Sigmate

Portable Keystores for Truffle projects. Sigmate acts as a lightwallet client for deployment and testing - providing convenience and flexibility for dev teams using truffle. As the upcoming truffle 3.0 release includes options for modular contracts and deployment, this tool is designed to help larger teams / projects with multiple deployers and/or account-specific roles.

### Benefits

* Simplified keystore management for deployment migrations
* Easily use remote / hosted Etheruem nodes (such as infura)
* Securely share keys in a standard format with team members
* Easy setup with CLI tool
* Seamless truffle integration

### Installation

```
npm install -g @digix/sigmate
```

### Usage

**Command Line Interface**

To begin, you must create a 'sigmate keystore' to be used for a particular deployment/testing environment.

```
$ sigmate keystore
```

You'll be then prompted to enter additional information, including a decryption key and optional seed phrase (if you are restoring from a phrase, enter it here, otherwise a new phrase will be generated):

```
prompt: Keystore label:  project-x
prompt: Decryption password:
prompt: Number of accounts (default 2):  4
prompt: 12 word mnemonic (optional):

Generated seed mnemonic:
gather fat run barrel champion resource close gasp pond wash twelve loan

Generating 4 accounts:
/Users/chris/.sigmate/project-x/UTC--2016-11-16T19-47-10.160Z--948f2a15797e2a41593a267f1f76da699f65aac5
/Users/chris/.sigmate/project-x/UTC--2016-11-16T19-47-11.048Z--86f3bbbe2173dc1021bbf7456bfaab9bebfab1e5
/Users/chris/.sigmate/project-x/UTC--2016-11-16T19-47-11.937Z--4cf40b064185a77527d8aad9abcd05126e77df8f
/Users/chris/.sigmate/project-x/UTC--2016-11-16T19-47-12.825Z--634759dea920d65132f4f271527cb6b4978bb038
```

A keystore consists of multiple private keys in the encrypted geth format, and is stored by default in `~/.sigmate/[label]/`. To check existing keystores, use `sigmate list`.

**Truffle.js**

Sigmate consumes a truffle config and automatically injects `networks` with a ProviderEngine (and custom Subprovider). For a given network, you must provide a `rpcUrl` and optional `keystore` object:

```javascript
module.exports = {
  networks: {
    testnet: sigmate.config({
      network_id: '3',
      rpcUrl: 'https://ropsten.infura.io',
      gas: 3000000,
      keystore: {
        label: 'key-name',
        password: 'secret',
      },
    }),
    default: sigmate.config({
      network_id: 'default',
      rpcUrl: 'http://localhost:6545',
    }),
  },
};
```

Using the above config, if you deploy using the `ropsten` network, the default `from` address will be set to be the first account in the given keystore; truffle will use this to sign all tests and deployment steps by default.
