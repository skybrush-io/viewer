/**
 * @file Slice of the state object that stores the settings of the viewer.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_DRONE_MODEL,
  DEFAULT_DRONE_RADIUS,
  INDOOR_DRONE_SIZE_SCALING_FACTOR,
} from '~/constants';

import type { DroneModelType } from './types';

interface SettingsSliceState {
  threeD: {
    scenery: 'disabled' | 'auto' | 'day' | 'night' | 'indoor';
    axes: boolean;
    grid: 'none' | '1x1' | '2x2';
    quality: 'low' | 'medium' | 'high';
    scaleLabels: boolean;
    showLabels: boolean;
    showStatistics: boolean;
    showYaw: boolean;
    droneRadius?: number;
    indoorDroneSizeScalingFactor?: number;
    droneModel?: DroneModelType;
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

    // Whether to scale the labels such that the ones that are farther from the
    // camera in the scene are larger to compensate for the distance
    scaleLabels: false,

    // Whether to show statistics about the rendering in an overlay
    showStatistics: false,

    // Whether to show the labels above the drones in the 3D view
    showLabels: false,

    // Whether to show yaw markers sitcking out of the drones in the 3D view
    showYaw: false,

    // Size of drones for outdoor shows
    droneRadius: DEFAULT_DRONE_RADIUS,

    // Multiplication factor for the drone size for indoor shows
    indoorDroneSizeScalingFactor: INDOOR_DRONE_SIZE_SCALING_FACTOR,

    // Drone model to use in the 3D view
    droneModel: DEFAULT_DRONE_MODEL,
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
