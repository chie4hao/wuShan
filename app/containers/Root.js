// @flow
import React from 'react';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';

import './Root.css';
import Text from './text';

type RootType = {
  store: {},
  history: {}
};

export default function Root({ store, history }: RootType) {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <ConnectedRouter history={history}>
          <Route path="/" component={Text} />
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  );
}
