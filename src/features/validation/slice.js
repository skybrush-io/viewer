/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import { createSlice } from '@reduxjs/toolkit';

import { clearLoadedShow } from '~/features/show/slice';

import { removeAllMessages } from './utils';

const { actions, reducer } = createSlice({
  name: 'validation',

  initialState: {
    messages: {
      byId: {},
      order: [],
    },

    selection: [],
    visiblePanels: [],
  },

  reducers: {
    setVisiblePanels: (state, action) => {
      const { payload } = action;
      if (Array.isArray(payload)) {
        state.visiblePanels = payload;
      }
    },

    setSelection: (state, action) => {
      const { payload } = action;
      if (Array.isArray(payload)) {
        state.selection = payload;
      }
    },
  },

  extraReducers: {
    [clearLoadedShow]: (state) => {
      removeAllMessages(state);
      state.selection = [];
    },
  },
});

export const { setSelection, setVisiblePanels } = actions;

export default reducer;
