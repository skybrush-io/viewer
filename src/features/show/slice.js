/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import { createSlice } from '@reduxjs/toolkit';

import { loadShow, withProgressIndicator } from './async';

const { actions, reducer } = createSlice({
  name: 'show',

  initialState: {
    id: 0, // used to allow 3D components to recognize when a new show is loaded
    data: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearLoadedShow: (state) => {
      state.data = null;
      state.error = null;
      state.id = 0;
    },

    loadShowFromObject: {
      reducer: () => {
        /* nothing to do, the loader saga will pick this up and take care of
         * everything */
      },
      prepare: (show, options = {}) => ({ payload: { show, options } }),
    },
  },

  extraReducers: {
    [loadShow.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.id += 1;
    },

    [loadShow.pending]: (state) => {
      state.loading = true;
    },

    [loadShow.rejected]: (state) => {
      state.loading = false;
      state.error = 'Failed to load drone show.';
    },

    [withProgressIndicator.pending]: (state) => {
      state.loading = true;
    },

    [withProgressIndicator.fulfilled]: (state) => {
      state.loading = false;
      state.error = null;
    },

    [withProgressIndicator.rejected]: (state) => {
      state.loading = false;
      state.error = 'Failed to load drone show.';
    },
  },
});

export const { clearLoadedShow, loadShowFromObject } = actions;

export default reducer;
