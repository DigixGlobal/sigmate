// main entrypoint
import Accounts from './accounts';
import Web3 from './web3';
import Contracts from './contracts';

export default function Sigmate(opts) {
  // parse parameters
  if (Array.isArray(opts)) {
    console.log('we have an array');
  } else {
    console.log('not an array');
  }

  const accounts = new Accounts(opts);
  const web3 = new Web3(accounts);
  const contracts = new Contracts(web3);

  return {
    accounts,
    web3,
    contracts,
  };
}
