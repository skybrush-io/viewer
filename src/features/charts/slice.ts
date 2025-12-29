import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { clearLoadedShow } from '~/features/show/slice';
import type { RootState } from '~/store';
import type { Chart, ChartCalculationState } from './types';

const chartsAdapter = createEntityAdapter<ChartCalculationState>();

const { actions, reducer } = createSlice({
  name: 'charts',

  initialState: chartsAdapter.getInitialState(undefined, {
    test: {
      id: 'test',
      status: 'calculating',
      progress: 42,
      error: 'Test error',
    },
  }),

  reducers: {
    _start: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      chartsAdapter.upsertOne(state, {
        id,
        status: 'calculating',
        data: undefined,
        progress: undefined,
        error: undefined,
      });
    },

    _cancel: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      chartsAdapter.upsertOne(state, {
        id,
        status: 'cancelled',
        error: undefined,
      });
    },

    _finishWithError: (
      state,
      action: PayloadAction<{ id: string; error: string }>
    ) => {
      const { id, error } = action.payload;
      chartsAdapter.upsertOne(state, {
        id,
        status: 'error',
        data: undefined,
        error,
      });
    },

    _finishSuccessfully: (
      state,
      action: PayloadAction<{ id: string; data: Chart }>
    ) => {
      const { id, data } = action.payload;
      chartsAdapter.upsertOne(state, {
        id,
        status: 'ready',
        progress: 100,
        data,
        error: undefined,
      });
    },

    _updateProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number | undefined }>
    ) => {
      const { id, progress } = action.payload;
      chartsAdapter.updateOne(state, { id, changes: { progress } });
    },

    removeAllCharts: (state) => {
      chartsAdapter.removeAll(state);
    },
  },

  extraReducers(builder) {
    builder.addCase(clearLoadedShow, (state) => {
      chartsAdapter.removeAll(state);
    });
  },
});

export const {
  _cancel,
  _start,
  _finishWithError,
  _finishSuccessfully,
  _updateProgress,
  removeAllCharts,
} = actions;

export const { selectEntities: selectChartMap, selectById: selectChartById } =
  chartsAdapter.getSelectors<RootState>((state) => state.charts);

export default reducer;
