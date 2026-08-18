import { delay, put, race, take } from 'redux-saga/effects';

import type { UpdaterApi } from '~/desktop/launcher/auto-update';

import {
  checkForUpdates as checkForUpdatesAction,
  installUpdate,
  setCheckInProgress,
  setUpdateError,
  setUpdateSupported,
} from './slice';
import type { UpdateError } from './types';

/** Number of seconds to wait before the first update check. */
const INITIAL_UPDATE_CHECK_DELAY_SEC = 5;

/** Number of seconds to wait between consecutive update checks. */
const UPDATE_CHECK_INTERVAL_SEC = 30 * 60; // 30 minutes

type UpdaterSagaOptions = {
  initialUpdateCheckDelaySec?: number;
  updateCheckIntervalSec?: number;
};

/**
 * Saga that checks for app updates periodically.
 */
function* autoUpdaterSaga(
  apiGetter: () => UpdaterApi | null | undefined,
  options: UpdaterSagaOptions = {}
): Generator<any, void, any> {
  const { checkForUpdates, quitAndInstallUpdate } = apiGetter() ?? {};
  if (!checkForUpdates || !quitAndInstallUpdate) {
    return;
  }

  const {
    initialUpdateCheckDelaySec = INITIAL_UPDATE_CHECK_DELAY_SEC,
    updateCheckIntervalSec = UPDATE_CHECK_INTERVAL_SEC,
  } = options;

  yield put(setUpdateSupported(true));

  let first = true;

  while (true) {
    const nextDelay = first
      ? initialUpdateCheckDelaySec
      : updateCheckIntervalSec;
    first = false;

    const result = yield race({
      delay: delay(nextDelay * 1000, true),
      check: take(checkForUpdatesAction),
      install: take(installUpdate),
    });
    let updateError: UpdateError | null = null;

    if (result.install) {
      try {
        yield quitAndInstallUpdate();
      } catch (error) {
        console.error('Error while installing update:', error);
        updateError = 'installFailed';
      }

      yield put(setUpdateError(updateError));
    } else {
      const invokedByUser = !!result.check;

      yield put(setCheckInProgress(true));
      try {
        yield checkForUpdates({ silent: !invokedByUser });
        // setUpdateInfo() will be called by the main process via RPC
      } catch (error) {
        if (invokedByUser) {
          console.error('Error while checking for updates:', error);
          updateError = 'checkFailed';
        }
      } finally {
        // We tried to use a minimum delay of 1 second here to make the UI look nicer
        // (no quick flash of the progress bar). However, this causes confusing user
        // feedback when the download is already downloaded as we will briefly display
        // 'Installing update' before falling back to a non-loading state.
        yield put(setCheckInProgress(false));
      }

      if (invokedByUser) {
        // Do not update the error in the state if the check was automatic; we do not
        // want to show an error message if an automatic check fails due to the
        // system being offline.
        yield put(setUpdateError(updateError));
      }
    }
  }
}

export default autoUpdaterSaga;
