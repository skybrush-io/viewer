import { loadShowFromObject } from './slice';

export const loadShowFromLocalFile = (filename) => async (dispatch) => {
  const { getShowAsObjectFromLocalFile } = window.bridge || {};

  if (getShowAsObjectFromLocalFile) {
    const show = await getShowAsObjectFromLocalFile(filename);
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
