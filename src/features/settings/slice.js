/**
 * @file Slice of the state object that stores the settings of the viewer.
 */

import config from 'config';
import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'settings',

  initialState: {
    hints: {
      playback: config.buttons.playbackHint,
    },

    threeD: {
      // Scenery to use in the 3D view
      scenery: 'night',

      // Whether to show grid lines on the ground in 3D view. Values correspond
      // to the 'grid' setting of aframe-environment-component; currently we
      // support 'none', '1x1' and '2x2'
      grid: 'none',

      // Rendering quality of the 3D view (low, medium or high)
      quality: 'medium',

      // Whether to show statistics about the rendering in an overlay
      showStatistics: false,
    },
  },

  reducers: {
    updateAppSettings: {
      prepare: (category, updates) => ({
        payload: { category, updates },
      }),

      reducer: (state, action) => {
        const { category, updates } = action.payload;

        if (state[category] !== undefined) {
          state[category] = { ...state[category], ...updates };
        }
      },
    },
  },
});

export const { updateAppSettings } = actions;

export default reducer;
