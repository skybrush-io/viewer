/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import { createSlice } from '@reduxjs/toolkit';
import { ShowSpecification } from '@skybrush/show-format';

import { loadShow, withProgressIndicator } from './async';

interface ShowSliceState {
  id: number;
  data: ShowSpecification | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShowSliceState = {
  id: 0, // used to allow 3D components to recognize when a new show is loaded
  data: null,
  loading: false,
  error: null,
};

const { actions, reducer } = createSlice({
  name: 'show',
  initialState,
  reducers: {
    clearLoadedShow(state) {
      state.data = null;
      state.error = null;
      state.id = 0;
    },

    loadShowFromObject: {
      reducer() {
        /* nothing to do, the loader saga will pick this up and take care of
         * everything */
      },
      prepare: (show: ShowSpecification, options = {}) => ({
        payload: { show, options },
      }),
    },
  },

  extraReducers(builder) {
    builder.addCase(loadShow.fulfilled, (state, action) => {
      state.data = action.payload as ShowSpecification;
      state.loading = false;
      state.error = null;
      state.id += 1;
    });

    builder.addCase(loadShow.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadShow.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to load drone show.';
    });

    builder.addCase(withProgressIndicator.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(withProgressIndicator.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(withProgressIndicator.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to load drone show.';
    });
  },
});

export const { clearLoadedShow, loadShowFromObject } = actions;

export default reducer;
