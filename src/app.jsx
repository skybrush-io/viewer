import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import SplashScreen from './components/SplashScreen';
import TopLevelView from './components/TopLevelView';

import store, { persistor } from './store';
import ThemeProvider from './theme';

require('react-cover-page/themes/default.css');
require('typeface-fira-sans');

/*
const rootStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%'
};

const rootInnerStyle = {
  display: 'flex',
  flexGrow: 1,
  width: '100%',
  height: '100%'
};
*/

const Application = () => (
  <StoreProvider store={store}>
    <ThemeProvider>
      <PersistGate persistor={persistor} loading={<SplashScreen />}>
        <CssBaseline />
        <TopLevelView />
      </PersistGate>
    </ThemeProvider>
  </StoreProvider>
);

export default Application;
