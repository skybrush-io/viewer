/**
 * @file Slice of the state object that stores the state of the 3D view.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pose } from '@skybrush/aframe-components/lib/spatial';
import type { Vector3Tuple } from '@skybrush/show-format';

type NavigationMode = 'walk' | 'fly';

type ThreeDSliceState = {
  camera: {
    /**
     * Override the initial camera pose when the 3D view is mounted. Used to
     * remember the camera pose when switching between the player and the
     * validation view.
     */
    overriddenPose: Pose | null;
    selectedIndex: number;
  };

  navigation: {
    mode: NavigationMode;
    parameters: Record<string, any>;
  };

  overlays: {
    visible: boolean;
  };
};

const initialState: ThreeDSliceState = {
  camera: {
    overriddenPose: null,
    selectedIndex: 0,
  },

  navigation: {
    mode: 'walk',
    parameters: {},
  },

  overlays: {
    visible: false,
  },
};

const { actions, reducer } = createSlice({
  name: 'threeD',
  initialState,
  reducers: {
    clearCameraPoseOverride(state) {
      state.camera.overriddenPose = null;
    },

    overrideCameraPose(state, action: PayloadAction<Pose>) {
      state.camera.overriddenPose = action.payload;
    },

    rememberCameraPose() {
      /* nop, the saga handles it */
    },

    resetZoom() {
      /* nop, the saga handles it */
    },

    rotateViewTowards(_state, _action: PayloadAction<Vector3Tuple>) {
      /* nop, the saga handles it */
    },

    setNavigationMode(
      state,
      action: PayloadAction<
        | NavigationMode
        | { mode: NavigationMode; parameters: Record<string, any> }
      >
    ) {
      const { payload } = action;

      if (typeof payload === 'string') {
        state.navigation.mode = payload;
        state.navigation.parameters = {};
      } else {
        const { mode, parameters } = payload;

        if (typeof mode === 'string' && typeof parameters === 'object') {
          state.navigation.mode = mode;
          state.navigation.parameters = parameters;
        }
      }
    },

    setOverlayVisibility(state, action: PayloadAction<boolean>) {
      state.overlays.visible = Boolean(action.payload);
    },

    setSelectedCameraIndex(state, action: PayloadAction<number>) {
      const index = Number(action.payload);
      if (index >= 0 && Number.isFinite(index) && Number.isInteger(index)) {
        state.camera.selectedIndex = index;
      }
    },

    switchToCameraPose(_state, _action: PayloadAction<Pose>) {
      /* nop, the saga handles it */
    },

    switchToSelectedCamera() {
      /* nop, the saga handles it */
    },
  },
});

export const {
  clearCameraPoseOverride,
  rememberCameraPose,
  resetZoom,
  rotateViewTowards,
  overrideCameraPose,
  setNavigationMode,
  setOverlayVisibility,
  setSelectedCameraIndex,
  switchToCameraPose,
  switchToSelectedCamera,
} = actions;

export default reducer;
