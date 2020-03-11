/**
 * @file The master store for the application state.
 */

import {
  configureStore,
  getDefaultMiddleware,
  isPlain
} from '@reduxjs/toolkit';

import isPromise from 'is-promise';
import localForage from 'localforage';
import isError from 'lodash-es/isError';
import isFunction from 'lodash-es/isFunction';
import createDeferred from 'p-defer';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createBlacklistFilter } from 'redux-persist-transform-filter';

import reducer from './features';
import { loadShow } from './features/show/async';
import { setOverlayVisibility } from './features/three-d/slice';

/**
 * Configuration of `redux-persist` to store the application state.
 *
 * In the browser, we store the state in the browser's local storage using
 * `localForage`.
 *
 * In the Electron version, we store the state in a separate JSON file using
 * `electron-store`.
 */
const persistConfig = {
  key: 'skybrush-viewer',
  storage: window.bridge ? window.bridge.createStateStore() : localForage,
  version: 1,
  stateReconciler: autoMergeLevel2,

  // do not store the following slices of the state in the storage
  blacklist: ['playback', 'show'],

  // do not save more frequently than once every second
  throttle: 1000 /* msec */,

  transforms: [createBlacklistFilter('threeD', ['camera', 'overlays'])]
};

/**
 * Redux middleware that manages long-running background processes.
 */
export const sagaMiddleware = createSagaMiddleware();

/**
 * The store for the application state.
 */
const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: [
    ...getDefaultMiddleware({
      immutableCheck: {
        // Checking the show specification takes a long time and it should not
        // be necessary anyway
        ignoredPaths: ['show.data']
      },

      serializableCheck: {
        /* redux-persist uses functions in actions and redux-promise-middleware
         * uses errors. This setting  silences a warning about them */
        isSerializable: value =>
          isPlain(value) ||
          isFunction(value) ||
          isPromise(value) ||
          isError(value),

        // Checking the action dispatched when a show was loaded successfully
        // takes a long time and it should not be necessary anyway
        ignoredActions: [loadShow.fulfilled.type],

        // Checking the show specification takes a long time and it should not
        // be necessary anyway
        ignoredPaths: ['show.data']
      }
    }),
    sagaMiddleware
  ],
  devTools: {
    actionsBlacklist: [setOverlayVisibility.type],

    // make sure that the show object that we load is not cached / tracked by
    // the Redux devtools
    actionSanitizer: action =>
      action.type === loadShow.fulfilled.type && action.payload
        ? { ...action, payload: '<<JSON_DATA>>' }
        : action,
    stateSanitizer: state =>
      state.show && state.show.data
        ? {
            ...state,
            show: { ...state.show, data: '<<JSON_DATA>>' }
          }
        : state
  }
});

/**
 * Deferred that is resolved when the state has been restored.
 */
const stateLoaded = createDeferred();

/**
 * Redux-persist persistor object that can be used to programmatically load
 * or save the state of the store.
 */
export const persistor = persistStore(store, null, stateLoaded.resolve);

/**
 * Function that clears the contents of the store completely. It is strongly
 * advised to reload the app after this function was executed.
 */
export const clearStore = persistor.purge;

/**
 * Async function that blocks execution until the state of the application has
 * been restored from local storage.
 */
export const waitUntilStateRestored = () => stateLoaded.promise;

// Send the store dispatcher function back to the preloader
if (window.bridge) {
  window.bridge.dispatch = store.dispatch;
}

export default store;
