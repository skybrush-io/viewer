/**
 * The root saga of the Skybrush Viewer application.
 */

import { all } from 'redux-saga/effects';

/**
 * The root saga of the Skybrush application.
 */
export default function* rootSaga() {
  const sagas = [];
  yield all(sagas);
}
