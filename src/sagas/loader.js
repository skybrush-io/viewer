/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */

import { put } from 'redux-saga/effects';

import { loadShow } from '~/features/show/async';

/**
 * Saga that loads the default hardcoded drone show when the app is started.
 */
export default function* loaderSaga() {
  const promise = import(
    /* webpackChunkName: "show" */ '~/../assets/shows/demo.json'
  ).then(module => module.default);
  yield put(loadShow(promise));
}
