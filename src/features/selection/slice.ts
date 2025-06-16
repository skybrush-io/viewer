/**
 * @file Slice of the state object that stores the selected drone indices in
 * the main view.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SelectionSliceState {
  droneIndices: number[];
}

const initialState: SelectionSliceState = {
  droneIndices: [],
};

const { actions, reducer } = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedDroneIndices(state, action: PayloadAction<number[]>) {
      state.droneIndices = action.payload;
    },
  },
});

export const { setSelectedDroneIndices } = actions;

export default reducer;
