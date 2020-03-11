/**
 * The root saga of the Skybrush Viewer application.
 */

import { all } from 'redux-saga/effects';

import loaderSaga from './loader';

/**
 * The root saga of the Skybrush application.
 */
export default function* rootSaga() {
  const sagas = [loaderSaga()];
  yield all(sagas);
}
