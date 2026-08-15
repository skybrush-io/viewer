import { delay, put, race, take } from 'redux-saga/effects';
import { getElectronBridge } from '~/window';
import {
  checkForUpdates as checkForUpdatesAction,
  installUpdate,
  setCheckInProgress,
  setUpdateInfo,
  setUpdateSupported,
} from './slice';
import { UpdateInfo } from './types';

/** Number of seconds to wait before the first update check. */
const INITIAL_UPDATE_CHECK_DELAY_SEC = 5;

/** Number of seconds to wait between consecutive update checks. */
const UPDATE_CHECK_INTERVAL_SEC = 30 * 60; // 30 minutes

/**
 * Saga that checks for app updates periodically.
 */
function* autoUpdaterSaga(): Generator<any, void, any> {
  const { checkForUpdates, quitAndInstallUpdate } = getElectronBridge() ?? {};
  if (!checkForUpdates || !quitAndInstallUpdate) {
    return;
  }

  yield put(setUpdateSupported(true));

  let first = true;

  while (true) {
    const nextDelay = first
      ? INITIAL_UPDATE_CHECK_DELAY_SEC
      : UPDATE_CHECK_INTERVAL_SEC;
    first = false;

    const result = yield race({
      delay: delay(nextDelay * 1000, true),
      check: take(checkForUpdatesAction),
      install: take(installUpdate),
    });

    if (result.install) {
      yield quitAndInstallUpdate();
    } else {
      const invokedByUser = !!result.check;
      const startedAt = Date.now();
      let successful = false;

      yield put(setCheckInProgress(true));
      try {
        const info: UpdateInfo = yield checkForUpdates({
          silent: !invokedByUser,
        });
        if (info) {
          yield put(setUpdateInfo(info));
        }
        successful = true;
      } catch (error) {
        if (invokedByUser) {
          console.error('Error while checking for updates:', error);
          alert('Error while checking for updates. Please try again later.');
        }
      } finally {
        const endedAt = Date.now();
        if (successful) {
          // If the update check was successful and took less than 1 second, wait a bit
          // before allowing the next check. This also looks nicer on the UI because
          // the progress bar will be visible for at least 1 second.
          const remainder = 1000 - (endedAt - startedAt);
          if (remainder > 0) {
            yield delay(remainder);
          }
        }
        yield put(setCheckInProgress(false));
      }
    }
  }
}

export default autoUpdaterSaga;
