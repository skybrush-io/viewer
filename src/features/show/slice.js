/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import { createSlice } from '@reduxjs/toolkit';

import { loadShow } from './async';

const { actions, reducer } = createSlice({
  name: 'show',

  initialState: {
    data: null,
    loading: false
  },

  reducers: {
    clearLoadedShow: state => {
      state.data = null;
    }
  },

  extraReducers: {
    [loadShow.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },

    [loadShow.pending]: state => {
      state.loading = true;
    },

    [loadShow.rejected]: state => {
      state.loading = false;
    }
  }
});

export const { clearLoadedShow } = actions;

export default reducer;
