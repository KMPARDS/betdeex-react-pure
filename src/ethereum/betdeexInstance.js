import { betdeex } from '../env';
import provider from './provider';
const ethers = require('ethers');

export default new ethers.Contract(betdeex.address, betdeex.abi, provider);;
