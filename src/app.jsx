import delay from 'delay';
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

require('react-cover-page/themes/dark.css');
require('typeface-fira-sans');

const waitForTopLevelView = async () => {
  // Give some time for the 3D scene to initialize itself
  await delay(1000);
};

const App = () => (
  <StoreProvider store={store}>
    <ThemeProvider>
      <ToastProvider placement='top-center'>
        <PersistGate persistor={persistor} onBeforeLift={waitForTopLevelView}>
          {(bootstrapped) => (
            <>
              <SplashScreen visible={!bootstrapped} />
              <CssBaseline />
              <TopLevelView />
              <Sidebar />
            </>
          )}
        </PersistGate>
      </ToastProvider>
    </ThemeProvider>
  </StoreProvider>
);

export default App;
