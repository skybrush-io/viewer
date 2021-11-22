import { getElapsedSeconds } from '~/features/playback/selectors';
import { getCenterOfBoundingBoxOfDronesAt } from '~/features/show/selectors';

import {
  resetZoom as _resetZoom,
  rotateViewTowards,
  setOverlayVisibility,
  setSelectedCameraIndex,
  switchToSelectedCamera,
} from './slice';

export const resetZoom = () => (dispatch) => {
  dispatch(_resetZoom());

  // Make the button that triggered the action lose focus so it won't be triggered
  // if the user presses Space to start playback
  document.body.focus();
};

export const rotateViewToDrones = () => (dispatch, getState) => {
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

export const switchToCameraByIndex = (index) => (dispatch) => {
  dispatch(setSelectedCameraIndex(index));
  dispatch(switchToSelectedCamera());
};

export const setOverlayHidden = () => (dispatch) => {
  dispatch(setOverlayVisibility(false));
};

export const setOverlayVisible = () => (dispatch) => {
  dispatch(setOverlayVisibility(true));
};
