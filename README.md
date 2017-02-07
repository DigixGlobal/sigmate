# Sigmate

An Ethereum keystore creation tool. It helps you manage eth-lightwallet keystores, which can be used in your dev team with truffle 3.0.

### Why?

* Simplified keystore management for deployment migrations
* Seamless truffle integration (with https://github.com/DigixGlobal/truffle-lightwallet-provider)
* Easily use remote / hosted Etheruem nodes (such as infura)
* Securely share keys in a standard format with team members
* Easy setup with CLI tool

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

Generated keystore with 4 accounts:
/Users/chris/.sigmate/sigmate-v3-project-x.json
- 0x....
- 0x....
- 0x....
- 0x....
```

A keystore is an eth-lightwallet json file of multiple private keys, encrypted. It stored by default in `~/.sigmate/sigmate-v3-[label].json`.

```
$ sigmate list
```

Will show a list of existing keystores, their addresses and location on disk.

```
$ sigmate expose
```

Will reveal the seed mnemonic and private keys of a given keystore.

## Truffle integration

See https://github.com/DigixGlobal/truffle-lightwallet-provider.
