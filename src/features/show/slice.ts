/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import {
  type ActionReducerMapBuilder,
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import type { ShowSpecification } from '@skybrush/show-format';

import { _doLoadShow, withProgressIndicator } from './async';
import type { ShowDataSource, ShowLoadingRequest } from './types';

interface ShowSliceState {
  /// Unique identifier for the show, incremented each time a new show is loaded.
  /// Used to allow 3D components to recognize when a new show is loaded.
  id: number;

  /// The loaded show data, or null if no show is loaded.
  data: ShowSpecification | null;

  /// The data source for the show, or null if no show is loaded. This can be
  /// used to implement reloading the show from the same source.
  source: ShowDataSource;

  /// Whether the show is currently being loaded.
  loading: boolean;

  /// Error that occurred while loading the show, or null if no error occurred.
  error: string | null;
}

const initialState: ShowSliceState = {
  id: 0,
  data: null,
  source: { type: 'object' },
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
      state.source = { type: 'object' };
      state.id = 0;
    },

    loadShowFromRequest(state, action: PayloadAction<ShowLoadingRequest>) {
      /* nothing to do, the loader saga will pick this up and take care of
       * everything */
    },

    setShowDataSource(state, action: PayloadAction<ShowDataSource>) {
      state.source = action.payload;
    },
  },

  extraReducers(builder: ActionReducerMapBuilder<ShowSliceState>) {
    builder.addCase(_doLoadShow.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.id += 1;
    });

    builder.addCase(_doLoadShow.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(_doLoadShow.rejected, (state) => {
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

export const { clearLoadedShow, loadShowFromRequest, setShowDataSource } =
  actions;

export default reducer;
