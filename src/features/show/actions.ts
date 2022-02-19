import type { AppThunk } from '~/store';
import { getElectronBridge } from '~/window';

import { withProgressIndicator } from './async';
import { loadShowFromObject } from './slice';

export const loadShowFromLocalFile =
  (filename: string): AppThunk =>
  async (dispatch) => {
    const { getShowAsObjectFromLocalFile } = getElectronBridge() ?? {};

    if (getShowAsObjectFromLocalFile) {
      const loadAction = await dispatch(
        withProgressIndicator(getShowAsObjectFromLocalFile(filename))
      );
      const show = loadAction.payload;
      dispatch(loadShowFromObject(show));
    }
  };

export const pickLocalFileAndLoadShow = (): AppThunk => async (dispatch) => {
  const { getShowAsObjectFromLocalFile, selectLocalShowFileForOpening } =
    getElectronBridge() ?? {};

  if (selectLocalShowFileForOpening && getShowAsObjectFromLocalFile) {
    const filename = await selectLocalShowFileForOpening();
    if (filename) {
      dispatch(loadShowFromLocalFile(filename));
    }
  }
};
