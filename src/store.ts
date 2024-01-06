/**
 * @file The master store for the application state.
 */

import {
  bindActionCreators,
  type Dispatch,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { configureStoreAndPersistence } from '@skybrush/redux-toolkit';

import reducer from './features';
import { _doLoadShow } from './features/show/async';
import {
  loadShowFromLocalFile,
  loadShowFromObject,
} from './features/show/actions';
import { setOverlayVisibility } from './features/three-d/slice';
import { setMode as setUIMode } from './features/ui/slice';
import { isElectronWindow } from './window';

/**
 * The store for the application state.
 */
export const { store, persistor } = configureStoreAndPersistence({
  reducer,

  storage: {
    key: 'skybrush-viewer',
    version: 1,

    // do not store the following slices of the state in the storage
    blacklist: [
      'audio',
      'playback',
      'show',
      'threeD.camera',
      'threeD.overlays',
      'ui.mode',
    ],
  },

  ignoredActions: [_doLoadShow.fulfilled.type],
  ignoredPaths: ['show.data'],

  devTools: {
    actionsDenylist: [setOverlayVisibility.type],
    scrubbedActions: [_doLoadShow.fulfilled.type],
    scrubbedPaths: ['show.data'],
  },
});

// Send some of the allowed actions back to the preloader, bound to the
// store instance. The preloader may then call these actions but cannot dispatch
// arbitrary actions to the store.
if (isElectronWindow(window)) {
  window.bridge.provideActions(
    bindActionCreators(
      {
        loadShowFromLocalFile,
        loadShowFromObject,
        setUIMode,
      },
      store.dispatch
    )
  );
}

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
export type AppDispatch = Dispatch;
