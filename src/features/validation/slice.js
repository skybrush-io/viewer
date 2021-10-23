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

    // For the validation settings, "null" means "use the setting from the show
    // file if given"
    settings: {
      maxAltitude: null,
      minDistance: null,
      maxVelocityXY: null,
      maxVelocityZ: null,
    },

    // List of validators that are disabled
    disabledValidators: [],

    // Current selection of drones to show on charts
    selection: [],

    // List of chart panels that are visible
    visiblePanels: [],
  },

  reducers: {
    setDisabledValidators: (state, action) => {
      const { payload } = action;
      if (Array.isArray(payload)) {
        state.disabledValidators = payload;
      }
    },

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

export const { setDisabledValidators, setSelection, setVisiblePanels } =
  actions;

export default reducer;
