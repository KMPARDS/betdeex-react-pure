import { bet } from '../env';
import provider from './provider';
const ethers = require('ethers');

const createBetInstance = _address => {
  let instance;
  if (window.walletInstance) {
    // connect with wallet
    // const wallet = new ethers.Wallet(privateKeys[0], new ethers.providers.InfuraProvider('rinkeby'));
    // const contractWithSigner = new ethers.Contract(betdeexAddress, betdeexAbi, wallet);
  } else {
    // connect without Wallet
    instance = new ethers.Contract(_address, bet.abi, provider);
  }

  return instance;
}

export default createBetInstance;
