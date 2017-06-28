import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createBrowserHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);

function configureStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(router, thunk));
}

export default { configureStore, history };
