import { getElapsedSeconds } from '~/features/playback/selectors';
import { getCenterOfBoundingBoxOfDronesAt } from '~/features/show/selectors';
import { AppThunk } from '~/store';

import {
  resetZoom as _resetZoom,
  rotateViewTowards,
  setOverlayVisibility,
  setSelectedCameraIndex,
  switchToSelectedCamera,
} from './slice';

export const resetZoom = (): AppThunk => (dispatch) => {
  dispatch(_resetZoom());

  // Make the button that triggered the action lose focus so it won't be triggered
  // if the user presses Space to start playback
  document.body.focus();
};

export const rotateViewToDrones = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const time = getElapsedSeconds(state);
  const center = getCenterOfBoundingBoxOfDronesAt(state, time);
  if (center) {
    dispatch(rotateViewTowards(center));
  }

  // Make the button that triggered the action lose focus so it won't be triggered
  // if the user presses Space to start playback
  document.body.focus();
};

export const switchToCameraByIndex =
  (index: number): AppThunk =>
  (dispatch) => {
    dispatch(setSelectedCameraIndex(index));
    dispatch(switchToSelectedCamera());
  };

export const setOverlayHidden = (): AppThunk => (dispatch) => {
  dispatch(setOverlayVisibility(false));
};

export const setOverlayVisible = (): AppThunk => (dispatch) => {
  dispatch(setOverlayVisibility(true));
};
