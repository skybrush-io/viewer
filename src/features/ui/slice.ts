/**
 * @file Slice of the state object that stores the main settings of the user
 * interface that do not belong elsewhere.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import config from 'config';

import { RECENT_FILE_COUNT } from './constants';
import { MODES, UIMode } from './modes';

type UISliceState = {
  mode: UIMode;
  recentFiles: string[];
};

const initialState: UISliceState = {
  mode: UIMode.PLAYER,
  recentFiles: [],
};

const { actions, reducer } = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addRecentFile(state, action: PayloadAction<string>) {
      const { payload } = action;

      state.recentFiles = [
        payload,
        ...state.recentFiles.filter((rf) => rf !== payload),
      ].slice(0, RECENT_FILE_COUNT);
    },

    _setMode(state, action: PayloadAction<UIMode>) {
      const { payload } = action;

      if (MODES.includes(payload) && config.modes[payload]) {
        state.mode = payload;
      }
    },
  },
});

export const { addRecentFile, _setMode } = actions;

export default reducer;
