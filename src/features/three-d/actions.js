import { setOverlayVisibility } from './slice';

export const setOverlayHidden = () => dispatch => {
  dispatch(setOverlayVisibility(false));
};

export const setOverlayVisible = () => dispatch => {
  dispatch(setOverlayVisibility(true));
};
