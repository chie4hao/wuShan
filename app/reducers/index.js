import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const rootReducer = function rootReducer(state = { show: 'showAll' }, action) {
  switch (action.type) {
    case 'setFilter':
      return { show: state.show + 1 };
    default:
      return state;
  }
};

const rootReducer1 = combineReducers({
  rootReducer,
  routerReducer
});

export default rootReducer1;
