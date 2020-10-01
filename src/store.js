/**
 * @file The master store for the application state.
 */

import { configureStoreAndPersistence } from '@skybrush/redux-toolkit';

import reducer from './features';
import { loadShow } from './features/show/async';
import { setOverlayVisibility } from './features/three-d/slice';
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
    blacklist: ['audio', 'playback', 'show', 'threeD.camera', 'threeD.overlays']
  },

  ignoredActions: [loadShow.fulfilled],
  ignoredPaths: ['show.data'],

  devTools: {
    actionsBlacklist: [setOverlayVisibility],
    scrubbedActions: [loadShow.fulfilled],
    scrubbedPaths: ['show.data']
  }
});

// Send the store dispatcher function back to the preloader
if (window.bridge) {
  window.bridge.dispatch = store.dispatch;
}

export default store;
