// main entrypoint
import getKeystore from './keystore';
import Web3 from './web3';
import Contracts from './contracts';

export default function Sigmate(opts, optionalLabel) {
  // resolve label for keystore
  const label = optionalLabel || (opts && opts.label);
  // map shorthand account names to object
  const accountOptions = opts.accounts || opts.reduce((acc, name) => ({ ...acc, [name]: true }), {});
  // initialize accounts
  return getKeystore({
    accounts: accountOptions,
    label,
  }).then(({ keystore, accounts }) => {
    const web3 = new Web3({ keystore, provider: opts.provider });
    const contracts = new Contracts({ keystore });
    return ({ web3, keystore, accounts, contracts });
  });
}
