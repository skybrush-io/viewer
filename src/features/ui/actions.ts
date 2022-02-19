import type { AppThunk } from '~/store';

import { UIMode } from './modes';
import { getCurrentMode } from './selectors';
import { setMode } from './slice';

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
