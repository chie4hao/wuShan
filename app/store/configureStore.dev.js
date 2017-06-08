import { createStore } from 'redux';
import rootReducer from '../reducers';

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState);
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }
  return store;
}

export default { configureStore };
