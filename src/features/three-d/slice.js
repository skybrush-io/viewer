/**
 * @file Slice of the state object that stores the state of the 3D view.
 */

import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'threeD',

  initialState: {
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
  },

  reducers: {
    resetZoom() {
      /* nop, the saga handles it */
    },

    rotateViewTowards() {
      /* nop, the saga handles it */
    },

    setCameraPose(state, action) {
      const { position, rotation } = action.payload;
      state.camera.position = position;
      state.camera.rotation = rotation;
    },

    setNavigationMode(state, action) {
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

    setOverlayVisibility(state, action) {
      state.overlays.visible = Boolean(action.payload);
    },

    setSelectedCameraIndex(state, action) {
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
