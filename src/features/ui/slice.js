/**
 * @file Slice of the state object that stores the main settings of the user
 * interface that do not belong elsewhere.
 */

import { createSlice } from '@reduxjs/toolkit';

import config from 'config';

import { MODES } from './modes';

const { actions, reducer } = createSlice({
  name: 'ui',

  initialState: {
    mode: 'player',
  },

  reducers: {
    setMode: (state, action) => {
      const { payload } = action;

      if (MODES.includes(payload) && config.modes[payload]) {
        state.mode = payload;
      }
    },
  },
});

export const { setMode } = actions;

export default reducer;
