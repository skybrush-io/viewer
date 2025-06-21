import type { AppThunk } from '~/store';

import { UIMode } from './modes';
import { getCurrentMode } from './selectors';
import { _setMode } from './slice';
import { rememberCameraPose } from '../three-d/slice';

/**
 * Action that switches the current mode of the UI.
 */
export const setMode =
  (mode: UIMode): AppThunk =>
  (dispatch, getState) => {
    const currentMode = getCurrentMode(getState());

    /* When leaving the player view, remember the current camera pose so we can
     * restore it when switching back to the player. */
    if (currentMode === UIMode.PLAYER) {
      dispatch(rememberCameraPose());
    }

    dispatch(_setMode(mode));
  };

/**
 * Action that switches to the given mode when it is not the active mode yet,
 * or switches back to player mode if the given mode is already the active one.
 */
export const toggleMode =
  (mode: UIMode): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    if (getCurrentMode(state) === mode) {
      dispatch(setMode(UIMode.PLAYER));
    } else {
      dispatch(setMode(mode));
    }
  };
