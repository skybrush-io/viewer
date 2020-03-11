/**
 * @file Slice of the state object that stores the state of the 3D view.
 */

import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'threeD',

  initialState: {
    camera: {
      position: null,
      rotation: null
    },

    navigation: {
      mode: 'walk',
      parameters: {}
    },

    overlays: {
      visible: false
    }
  },

  reducers: {
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
    }
  }
});

export const {
  setCameraPose,
  setNavigationMode,
  setOverlayVisibility
} = actions;

export default reducer;
