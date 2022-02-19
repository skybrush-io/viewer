/**
 * @file Slice of the state object that stores the main settings of the user
 * interface that do not belong elsewhere.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import config from 'config';

import { UIMode, MODES } from './modes';

interface UISliceState {
  mode: UIMode;
}

const initialState: UISliceState = {
  mode: UIMode.PLAYER,
};

const { actions, reducer } = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<UIMode>) {
      const { payload } = action;

      if (MODES.includes(payload) && config.modes[payload]) {
        state.mode = payload;
      }
    },
  },
});

export const { setMode } = actions;

export default reducer;
