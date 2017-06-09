// @flow
import React from 'react';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './Root.css';
import Text from './text';

type RootType = {
  store: {}
};

export default function Root({ store }: RootType) {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <Text />
      </MuiThemeProvider>
    </Provider>
  );
}
