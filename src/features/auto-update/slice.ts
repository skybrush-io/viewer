/**
 * @file Slice of the state object that stores the status of the auto-update functionality
 * of the application.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UpdateInfo } from '~/desktop/launcher/auto-update';

type AutoUpdateSliceState = {
  /** Whether the application is currently checking for updates. */
  checking: boolean;
  /** Whether auto-updates are supported in the current application. */
  supported: boolean;
  /** Information about the available update, if any. */
  updateInfo: UpdateInfo;
};

const initialState: AutoUpdateSliceState = {
  checking: false,
  supported: false,
  updateInfo: {
    available: false,
    downloaded: false,
    downloading: false,
    version: null,
  },
};

const { actions, reducer } = createSlice({
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

    setUpdateInfo(state, action: PayloadAction<UpdateInfo>) {
      const { payload } = action;
      state.updateInfo = payload;
    },

    setUpdateSupported(state, action: PayloadAction<boolean>) {
      const { payload } = action;
      state.supported = payload;
    },
  },
});

export const {
  checkForUpdates,
  installUpdate,
  setCheckInProgress,
  setUpdateInfo,
  setUpdateSupported,
} = actions;

export default reducer;
