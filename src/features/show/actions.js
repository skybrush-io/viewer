import { loadShow } from './async';

export const loadShowFromLocalFile = () => async (dispatch) => {
  const { loadShowFromFile, selectLocalShowFileForOpening } =
    window.bridge || {};

  if (selectLocalShowFileForOpening && loadShowFromFile) {
    const filename = await selectLocalShowFileForOpening();
    if (filename) {
      dispatch(loadShow(loadShowFromFile(filename)));
    }
  }
};
