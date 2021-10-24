import { withProgressIndicator } from './async';
import { loadShowFromObject } from './slice';

export const loadShowFromLocalFile = (filename) => async (dispatch) => {
  const { getShowAsObjectFromLocalFile } = window.bridge || {};

  if (getShowAsObjectFromLocalFile) {
    const loadAction = await dispatch(
      withProgressIndicator(getShowAsObjectFromLocalFile(filename))
    );
    const show = loadAction.payload;
    dispatch(loadShowFromObject(show));
  }
};

export const pickLocalFileAndLoadShow = () => async (dispatch) => {
  const { getShowAsObjectFromLocalFile, selectLocalShowFileForOpening } =
    window.bridge || {};

  if (selectLocalShowFileForOpening && getShowAsObjectFromLocalFile) {
    const filename = await selectLocalShowFileForOpening();
    if (filename) {
      dispatch(loadShowFromLocalFile(filename));
    }
  }
};
