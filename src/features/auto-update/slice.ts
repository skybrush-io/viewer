/**
 * @file Slice of the state object that stores the status of the auto-update functionality
 * of the application.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UpdateInfo } from '~/desktop/launcher/auto-update';
import type { UpdateError } from './types';

type AutoUpdateSliceState = {
  /** Whether the application is currently checking for updates. */
  checking: boolean;
  /** Error during the last check or installation attempt, if any. */
  error: UpdateError | null;
  /** Whether auto-updates are supported in the current application. */
  supported: boolean;
  /** Information about the available update, if any. */
  updateInfo: UpdateInfo;
};

const initialState: AutoUpdateSliceState = {
  checking: false,
  error: null,
  supported: false,
  updateInfo: {
    available: false,
    downloaded: false,
    downloadProgress: null,
    version: null,
  },
};

const { actions, reducer, selectors } = createSlice({
  name: 'autoUpdate',
  initialState,

  reducers: {
    checkForUpdates() {
      /* nothing to do, the saga will handle it */
    },

    installUpdate() {
      /* nothing to do, the saga will handle it */
    },

    setCheckInProgress(state, action: PayloadAction<boolean>) {
      const { payload } = action;
      state.checking = payload;
    },

    setUpdateError(state, action: PayloadAction<UpdateError | null>) {
      const { payload } = action;
      state.error = payload;
    },

    setUpdateInfo(state, action: PayloadAction<UpdateInfo>) {
      const { payload } = action;
      state.updateInfo = payload;
    },

    setUpdateSupported(state, action: PayloadAction<boolean>) {
      const { payload } = action;
      state.supported = payload;
    },
  },

  selectors: {
    selectAutoUpdateState: (state) => ({
      error: state.error,
      isCheckingForUpdates: state.checking,
      isDownloadingUpdate:
        typeof state.updateInfo.downloadProgress === 'number',
      downloadProgress: state.updateInfo.downloadProgress,
      updateAvailable: state.updateInfo.available,
      updateDownloaded: state.updateInfo.downloaded,
      updateSupported: state.supported,
    }),
  },
});

export const {
  checkForUpdates,
  installUpdate,
  setCheckInProgress,
  setUpdateError,
  setUpdateInfo,
  setUpdateSupported,
} = actions;

export const { selectAutoUpdateState } = selectors;

export default reducer;
