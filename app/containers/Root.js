// @flow
import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import './Root.css';
import Text from './text';
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

function visibilityFilter(state = { show: 'showAll' }, action) {
  switch (action.type) {
    case 'setFilter':
      return { show: state.show + 1 };
    default:
      return state;
  }
}

const store = createStore(visibilityFilter);

export default function Root() {
  return (
    <Provider store={store}>
      <Text />
    </Provider>
  );
}
