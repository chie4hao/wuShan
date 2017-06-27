import { createStore, applyMiddleware } from 'redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(router));
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }
  return store;
}

export default { configureStore, history };
