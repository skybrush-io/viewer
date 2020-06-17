import { requestToLoadShow } from './slice';

export const loadShowFromLocalFile = () => async (dispatch) => {
  const { loadShowFromFile, selectLocalShowFileForOpening } =
    window.bridge || {};

  if (selectLocalShowFileForOpening && loadShowFromFile) {
    const filename = await selectLocalShowFileForOpening();
    if (filename) {
      dispatch(requestToLoadShow(loadShowFromFile(filename)));
    }
  }
};
