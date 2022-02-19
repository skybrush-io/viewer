/**
 * @file Slice of the state object that stores the state of the 3D view.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Vector } from '@skybrush/show-format';

type NavigationMode = 'walk' | 'fly';

interface ThreeDSliceState {
  camera: {
    position: Vector | null;
    rotation: Vector | null;
    selectedIndex: number;
  };

  navigation: {
    mode: NavigationMode;
    parameters: Record<string, any>;
  };

  overlays: {
    visible: boolean;
  };
}

const initialState: ThreeDSliceState = {
  camera: {
    position: null,
    rotation: null,
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
    resetZoom() {
      /* nop, the saga handles it */
    },

    rotateViewTowards(_state, _action: PayloadAction<Vector>) {
      /* nop, the saga handles it */
    },

    setCameraPose(
      state,
      action: PayloadAction<{ position: Vector; rotation: Vector }>
    ) {
      const { position, rotation } = action.payload;
      state.camera.position = position;
      state.camera.rotation = rotation;
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

    switchToSelectedCamera() {
      /* nop, the saga handles it */
    },
  },
});

export const {
  resetZoom,
  rotateViewTowards,
  setCameraPose,
  setNavigationMode,
  setOverlayVisibility,
  setSelectedCameraIndex,
  switchToSelectedCamera,
} = actions;

export default reducer;
