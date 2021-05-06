/**
 * @file The master store for the application state.
 */

import { bindActionCreators } from '@reduxjs/toolkit';
import { configureStoreAndPersistence } from '@skybrush/redux-toolkit';

import reducer from './features';
import { loadShow } from './features/show/async';
import { requestToLoadShow } from './features/show/slice';
import { setOverlayVisibility } from './features/three-d/slice';
import { setMode as setUIMode } from './features/ui/slice';
import rootSaga from './sagas';

/**
 * The store for the application state.
 */
export const { store, persistor } = configureStoreAndPersistence({
  reducer,
  sagas: rootSaga,

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

  ignoredActions: [loadShow.fulfilled],
  ignoredPaths: ['show.data'],

  devTools: {
    actionsBlacklist: [setOverlayVisibility],
    scrubbedActions: [loadShow.fulfilled],
    scrubbedPaths: ['show.data'],
  },
});

// Send some of the allowed actions back to the preloader, bound to the
// store instance. The preloader may then call these actions but cannot dispatch
// arbitrary actions to the store.
if (window.bridge) {
  window.bridge.provideActions(
    bindActionCreators(
      {
        requestToLoadShow,
        setUIMode,
      },
      store.dispatch
    )
  );
}

export default store;
