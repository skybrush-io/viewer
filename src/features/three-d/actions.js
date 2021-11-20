import { getElapsedSeconds } from '~/features/playback/selectors';
import { getCenterOfBoundingBoxOfDronesAt } from '~/features/show/selectors';

import {
  rotateViewTowards,
  setOverlayVisibility,
  setSelectedCameraIndex,
  switchToSelectedCamera,
} from './slice';

export { resetZoom } from './slice';

export const rotateViewToDrones = () => (dispatch, getState) => {
  const state = getState();
  const time = getElapsedSeconds(state);
  const center = getCenterOfBoundingBoxOfDronesAt(state, time);
  if (center) {
    dispatch(rotateViewTowards(center));
  }
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
