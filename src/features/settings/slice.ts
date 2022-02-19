/**
 * @file Slice of the state object that stores the settings of the viewer.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsSliceState {
  threeD: {
    scenery: 'auto' | 'day' | 'night' | 'indoor';
    axes: boolean;
    grid: 'none' | '1x1' | '2x2';
    quality: 'low' | 'medium' | 'high';
    showStatistics: false;
  };
}

const initialState: SettingsSliceState = {
  threeD: {
    // Scenery to use in the 3D view
    scenery: 'auto',

    // Whether to show the coordinate system axes in 3D view.
    axes: false,

    // Whether to show grid lines on the ground in 3D view. Values correspond
    // to the 'grid' setting of aframe-environment-component; currently we
    // support 'none', '1x1' and '2x2'
    grid: 'none',

    // Rendering quality of the 3D view (low, medium or high)
    quality: 'medium',

    // Whether to show statistics about the rendering in an overlay
    showStatistics: false,
  },
};

const { actions, reducer } = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateAppSettings: {
      prepare: (category: string, updates: Record<string, any>) => ({
        payload: { category, updates },
      }),

      reducer(
        state,
        action: PayloadAction<{
          category: string;
          updates: Record<string, any>;
        }>
      ) {
        const { category, updates } = action.payload;
        const state_ = state as any;

        if (state_[category] !== undefined) {
          state_[category] = { ...state_[category], ...updates };
        }
      },
    },
  },
});

export const { updateAppSettings } = actions;

export default reducer;
