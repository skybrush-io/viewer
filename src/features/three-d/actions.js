import {
  setOverlayVisibility,
  setSelectedCameraIndex,
  switchToSelectedCamera,
} from './slice';

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
