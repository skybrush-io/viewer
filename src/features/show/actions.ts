import type { ShowSpecification } from '@skybrush/show-format';

import { addRecentFile } from '~/features/ui/slice';
import type { AppThunk } from '~/store';
import { getElectronBridge } from '~/window';

import { withProgressIndicator } from './async';
import { loadShowFromRequest } from './slice';

export const loadShowFromLocalFile =
  (filename: string): AppThunk =>
  async (dispatch) => {
    const { getShowAsObjectFromLocalFile } = getElectronBridge() ?? {};

    if (getShowAsObjectFromLocalFile) {
      const loadAction = await dispatch(
        withProgressIndicator(() => getShowAsObjectFromLocalFile(filename))
      );
      const show: ShowSpecification = loadAction.payload as ShowSpecification;
      dispatch(
        loadShowFromRequest({ show, source: { type: 'file', filename } })
      );
      dispatch(addRecentFile(filename));
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

export const loadShowFromObject =
  (show: ShowSpecification): AppThunk =>
  (dispatch) => {
    dispatch(loadShowFromRequest({ show, source: { type: 'object' } }));
  };

export const reloadShow = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const source = state.show.source;

  if (source.type === 'file') {
    dispatch(loadShowFromLocalFile(source.filename));
  }

  // We cannot reload from this source, so we just return.
  console.warn(`Cannot reload show from source of type ${source.type}`);
};
