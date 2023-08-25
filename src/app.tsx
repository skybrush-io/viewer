import delay from 'delay';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { PersistGate } from 'redux-persist/es/integration/react';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';

import DragDropHandler from './components/DragDropHandler';
import MainTopLevelView from './components/MainTopLevelView';
import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';
import WindowTitleManager from './components/WindowTitleManager';

import { loadShowFromRequest } from './features/show/slice';
import { type ShowLoadingRequest } from './features/show/types';
import AppHotkeys from './hotkeys';
import rootSaga from './sagas';
import { persistor, store } from './store';
import ThemeProvider from './theme';

import '~/../assets/css/aframe.less';

import 'react-cover-page/themes/dark.css';
import 'typeface-fira-sans';

interface AppProps {
  readonly initialShow?: ShowLoadingRequest;
}

const App = ({ initialShow }: AppProps) => {
  const waitForTopLevelView = React.useCallback(async () => {
    // Start the root saga
    store.runSaga(rootSaga);

    // Load the initial show file (if any)
    if (initialShow) {
      store.dispatch(loadShowFromRequest(initialShow));
    }

    // Give some time for the 3D scene to initialize itself
    await delay(1000);
  }, [initialShow]);

  return (
    <StoreProvider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <ToastProvider placement='top-center'>
            <PersistGate
              persistor={persistor}
              onBeforeLift={waitForTopLevelView}
            >
              {(bootstrapped) => (
                <>
                  <SplashScreen visible={!bootstrapped} />
                  <DragDropHandler />
                  <WindowTitleManager appName='Skybrush Viewer' />
                  <CssBaseline />
                  <AppHotkeys>
                    <MainTopLevelView />
                  </AppHotkeys>
                  <Sidebar />
                </>
              )}
            </PersistGate>
          </ToastProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StoreProvider>
  );
};

export default App;
