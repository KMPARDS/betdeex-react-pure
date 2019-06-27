import store from '../store';
const ethers = require('ethers');

const state = store.getState();
console.log('store state in provider', state);

if(!Object.entries(state.providerInstance).length) {
  store.dispatch({
    type: 'LOAD-PROVIDER-INSTANCE',
    payload: new ethers.providers.InfuraProvider('rinkeby')
  });
}

const newState = store.getState();
console.log('updated state o fprovider', newState.providerInstance);

export default newState.providerInstance;
