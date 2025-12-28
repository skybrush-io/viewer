import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { clearLoadedShow } from '~/features/show/slice';
import type { ChartCalculationState } from './types';

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

export const { removeAllCharts } = actions;

export default reducer;
