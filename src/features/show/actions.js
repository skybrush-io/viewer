import { loadShowFromObject } from './slice';

export const loadShowFromLocalFile = (filename) => (dispatch) => {
  const { loadShowFromFile } = window.bridge || {};

  if (loadShowFromFile) {
    dispatch(loadShowFromObject(loadShowFromFile(filename)));
  }
};

export const pickLocalFileAndLoadShow = () => async (dispatch) => {
  const { loadShowFromFile, selectLocalShowFileForOpening } =
    window.bridge || {};

  if (selectLocalShowFileForOpening && loadShowFromFile) {
    const filename = await selectLocalShowFileForOpening();
    if (filename) {
      dispatch(loadShowFromLocalFile(filename));
    }
  }
};
