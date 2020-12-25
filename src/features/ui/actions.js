import { getCurrentMode } from './selectors';
import { setMode } from './slice';

/**
 * Action that switches to the given mode when it is not the active mode yet,
 * or switches back to player mode if the given mode is already the active one.
 */
export const toggleMode = (mode) => (dispatch, getState) => {
  const state = getState();
  if (getCurrentMode(state) === mode) {
    dispatch(setMode('player'));
  } else {
    dispatch(setMode(mode));
  }
};
