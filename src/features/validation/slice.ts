/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import {
  type ActionReducerMapBuilder,
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import { clearLoadedShow } from '~/features/show/slice';

import type { ValidationPanel } from './panels';
import { removeAllMessages } from './utils';

export type ValidationSliceState = {
  messages: {
    byId: Record<string, string>;
    order: string[];
  };

  disabledValidators: string[];
  selection: string[];
  visiblePanels: ValidationPanel[];
};

const initialState: ValidationSliceState = {
  messages: {
    byId: {},
    order: [],
  },

  // List of validators that are disabled
  disabledValidators: [],

  // Current selection of drones to show on charts
  selection: [],

  // List of chart panels that are visible
  visiblePanels: [],
};

const { actions, reducer } = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setDisabledValidators(state, action: PayloadAction<string[]>) {
      const { payload } = action;
      if (Array.isArray(payload)) {
        state.disabledValidators = payload;
      }
    },

    setVisiblePanels(state, action: PayloadAction<ValidationPanel[]>) {
      const { payload } = action;
      if (Array.isArray(payload)) {
        state.visiblePanels = payload;
      }
    },

    setSelection(state, action: PayloadAction<string[]>) {
      const { payload } = action;
      if (Array.isArray(payload)) {
        state.selection = payload;
      }
    },
  },

  extraReducers(builder: ActionReducerMapBuilder<ValidationSliceState>) {
    builder.addCase(clearLoadedShow, (state) => {
      removeAllMessages(state);
      state.selection = [];
    });
  },
});

export const { setDisabledValidators, setSelection, setVisiblePanels } =
  actions;

export default reducer;
