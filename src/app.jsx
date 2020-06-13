import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { PersistGate } from 'redux-persist/es/integration/react';

import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';
import TopLevelView from './components/TopLevelView';

import store, { persistor } from './store';
import ThemeProvider from './theme';

require('~/../assets/css/aframe.less');

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

const App = () => (
  <StoreProvider store={store}>
    <ThemeProvider>
      <ToastProvider placement='top-center'>
        <PersistGate persistor={persistor} loading={<SplashScreen />}>
          <CssBaseline />
          <TopLevelView />
          <Sidebar />
        </PersistGate>
      </ToastProvider>
    </ThemeProvider>
  </StoreProvider>
);

export default App;
