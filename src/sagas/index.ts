/**
 * The root saga of the Skybrush Viewer application.
 */

import { saga as autoUpdaterSaga } from '@skybrush/electron-app-updater-integration';
import { all } from 'redux-saga/effects';

import cameraAnimatorSaga from '~/features/three-d/saga';

import loaderSaga from './loader';

/**
 * The root saga of the Skybrush application.
 */
function* rootSaga() {
  const sagas = [loaderSaga(), cameraAnimatorSaga(), autoUpdaterSaga()];
  yield all(sagas);
}

export default rootSaga;
