/**
 * The root saga of the Skybrush Viewer application.
 */

import { all } from 'redux-saga/effects';

import autoUpdaterSaga from '~/features/auto-update/saga';
import cameraAnimatorSaga from '~/features/three-d/saga';
import { getElectronBridge } from '~/window';

import loaderSaga from './loader';

/**
 * The root saga of the Skybrush application.
 */
function* rootSaga() {
  const sagas = [
    loaderSaga(),
    cameraAnimatorSaga(),
    autoUpdaterSaga(getElectronBridge),
  ];
  yield all(sagas);
}

export default rootSaga;
