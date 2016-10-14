// main entrypoint
import Keystore from './keystore';
import Balances from './balances';
import Web3 from './web3';
import Contracts from './contracts';

export default function Sigmate(opts, optionalLabel) {
  // resolve label for keystore
  const label = optionalLabel || (opts && opts.label);
  // map shorthand account names to object
  const accountOptions = opts.accounts || opts.reduce((acc, name) => ({ ...acc, [name]: true }), {});
  // initialize accounts
  return new Keystore({
    label,
    accounts: accountOptions,
  }).then((res) => {
    // skip if fundAccounts not set
    if (!opts.fundAccounts) { return res; }
    if (!opts.web3) {
      throw Error('web3 must be set if you wish to fund accounts');
    }
    return new Promise((resolve) => {
      return new Balances({
        accountOptions,
        web3: opts.web3,
        defaultAmount: opts.fundAccounts,
        accounts: res.accounts,
      }).then(accounts => resolve({ ...res, accounts }));
    });
  }).then(({ keystore, accounts }) => {
    const web3 = new Web3({ keystore, web3: opts.web3 });
    const contracts = new Contracts({ keystore });
    return ({ web3, keystore, accounts, contracts });
  });
}
