// @flow
import React from 'react';
import { Provider } from 'react-redux';
import './Root.css';
import { createStore } from 'redux';
// import { ConnectedRouter } from 'react-router-redux';
/* import Routes from '../routes';

type RootType = {
  store: {},
  history: {}
};

export default function Root({ store, history }: RootType) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}
*/

function visibilityFilter(state = 'showAll', action) {
  switch (action.type) {
    case 'setFilter':
      return action.filter;
    default:
      return state;
  }
}

const store = createStore(visibilityFilter);

export default function Root() {
  return (
    <Provider store={store}>
      <div>2</div>
    </Provider>
  );
}
