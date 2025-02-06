import delay from 'delay';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider as StoreProvider } from 'react-redux';
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
import ThemeProvider, { toastOptions } from './theme';

import '~/../assets/css/aframe.less';

import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/500.css';
import 'react-cover-page/themes/dark.css';
import LanguageWatcher from './i18n/LanguageWatcher';

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
          <PersistGate persistor={persistor} onBeforeLift={waitForTopLevelView}>
            {(bootstrapped) => (
              <>
                <SplashScreen visible={!bootstrapped} />
                <DragDropHandler />
                <WindowTitleManager appName='Skybrush Viewer' />
                <LanguageWatcher />
                <CssBaseline />
                <AppHotkeys>
                  <MainTopLevelView />
                </AppHotkeys>
                <Sidebar />
                <Toaster toastOptions={toastOptions} />
              </>
            )}
          </PersistGate>
        </ThemeProvider>
      </StyledEngineProvider>
    </StoreProvider>
  );
};

export default App;
