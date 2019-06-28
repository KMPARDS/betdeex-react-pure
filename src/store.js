import { applyMiddleware, createStore } from "redux";

const initialState = {
  walletInstance: {},
  esInstance: {},
  betdeexInstance: {},
  providerInstance: {},
  betsMapping: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD-WALLET-INSTANCE':
      return {...state, walletInstance: action.payload};
    case 'LOAD-ES-INSTANCE':
      return {...state, esInstance: action.payload};
    case 'LOAD-BETDEEX-INSTANCE':
      return {...state, betdeexInstance: action.payload};
    case 'LOAD-PROVIDER-INSTANCE':
      return {...state, providerInstance: action.payload};
    case 'LOAD-BETS-MAPPING-FROM-LOCALSTORAGE':
      return {...state, betsMapping: action.payload};
    case 'UPDATE-BETS-MAPPING':
      return {...state, betsMapping: action.payload};
    case 'UPDATE-BETS-MAPPING-ADDBET':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            description: undefined,
            isDrawPossible: undefined,
            category: undefined,
            subCategory: undefined,
            finalResult: undefined,
            endedBy: undefined,
            creationTimestamp: undefined,
            pauseTimestamp: undefined,
            endTimestamp: undefined,
            minimumBetInExaEs: undefined,
            pricePercentPerThousand: undefined,
            totalBetTokensInExaEsByChoice: undefined,
            getNumberOfChoiceBettors: undefined
          }
        }
      };
    case 'UPDATE-BETS-MAPPING-DESCRIPTION':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            description: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-ISDRAWPOSSIBLE':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            isDrawPossible: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-CATEGORY':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            category: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-SUBCATEGORY':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            subCategory: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-FINALRESULT':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            finalResult: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-ENDEDBY':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            endedBy: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-CREATIONTIMESTAMP':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            creationTimestamp: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-PAUSETIMESTAMP':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            pauseTimestamp: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-ENDTIMESTAMP':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            endTimestamp: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-MINIMUMBET':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            minimumBetInExaEs: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-PRICEPERCENT':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            pricePercentPerThousand: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-TOTALBETBYCHOICE':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            totalBetTokensInExaEsByChoice: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-NUMBERBETTORSBYCHOICE':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            getNumberOfChoiceBettors: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-TOTALPRIZE':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            totalPrize: action.payload.value
          }
        }
    };
    case 'UPDATE-BETS-MAPPING-BETTORS':
      return {
        ...state,
        betsMapping: {
          ...state.betsMapping,
          [action.payload.address]: {
            ...state.betsMapping[action.payload.address],
            bettorsByChoice: action.payload.value
          }
        }
    };
    default:
      return state;
    }
};

// middleware
const walletChangeUpdater = store => next => action => {

  // we are getting action on every dispatch. can write logic to update the navbar set state.
  try {
    window.updateTheNavbar(action);
  } catch (e) {
    console.log(e.message);
  }

  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const store = createStore(reducer, initialState, applyMiddleware(walletChangeUpdater));

export default store;
