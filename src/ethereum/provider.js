import store from '../store';
const ethers = require('ethers');

const state = store.getState();

if(!Object.entries(state.providerInstance).length) {
  store.dispatch({
    type: 'LOAD-PROVIDER-INSTANCE',
    payload: new ethers.providers.InfuraProvider('rinkeby')
  });
}

const newState = store.getState();

export default newState.providerInstance;
