import { bet } from '../env';
import provider from './provider';
const ethers = require('ethers');

const createBetInstance = (_address, _wallet) => {
  let instance;
  if (Object.entries(_wallet).length) {
    // connect with wallet
    // const wallet = new ethers.Wallet(privateKeys[0], new ethers.providers.InfuraProvider('rinkeby'));
    instance = new ethers.Contract(_address, bet.abi, _wallet);
  } else {
    // connect without Wallet
    instance = new ethers.Contract(_address, bet.abi, provider);
  }

  return instance;
}

export default createBetInstance;
