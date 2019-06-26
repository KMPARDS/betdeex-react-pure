import { applyMiddleware, createStore } from "redux";

const initialState = {
  walletInstance: {},
  esContractInstance: {},
  display: {
    category: null,
    subCategory: null
  },
  results: {
    category: null,
    subCategory: null
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD-WALLET-INSTANCE':
      return {...state, walletInstance: action.payload};
    case 'LOAD-ES-INSTANCE':
      return {...state, esContractInstance: action.payload};
    case 'CHANGE-DISPLAY-CATEGORY':
      return {...state, display: action.payload};
    default:
      return state;
    }
};

// middleware
const walletChangeUpdater = store => next => action => {

  // we are getting action on every dispatch. can write logic to update the navbar set state.
  window.updateTheNavbar(action);

  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const store = createStore(reducer, initialState, applyMiddleware(walletChangeUpdater));

export default store;
