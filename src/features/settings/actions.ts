import type { ChangeEvent } from 'react';

import type { AppThunk } from '~/store';

import { updateAppSettings } from './slice';

export const setScenery =
  (event: ChangeEvent<HTMLInputElement>): AppThunk =>
  (dispatch) => {
    dispatch(updateAppSettings('threeD', { scenery: event.target.value }));
  };

export const toggleAxes = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { axes } = state.settings.threeD;

  dispatch(updateAppSettings('threeD', { axes: !axes }));
};

export const toggleGrid = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { grid } = state.settings.threeD;

  dispatch(
    updateAppSettings('threeD', { grid: grid === 'none' ? '1x1' : 'none' })
  );
};
