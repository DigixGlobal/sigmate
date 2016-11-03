// main entrypoint
import Keystore from './keystore';
import Balances from './balances';
import Web3 from './web3';
import Contracts from './contracts';

export default function Sigmate(opts = {}) {
  // initialize accounts
  return new Keystore(opts)
  .then((res) => {
    // skip if fundAccounts not set
    if (!opts.prefund) { return res; }
    // transfer balance
    return new Balances({ ...opts, ...res });
  })
  .then((res) => {
    const web3 = new Web3(res);
    const contracts = new Contracts(res);
    const { keystore, accounts } = res;
    return { web3, keystore, accounts, contracts };
  });
}
