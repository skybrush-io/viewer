import type { ChangeEvent } from 'react';

import type { AppThunk } from '~/store';
import type { SceneryType } from '~/views/player/Scenery';

import { updateAppSettings } from './slice';
import type { DroneModelType } from './types';

export const setDroneRadius = (droneRadius: number) =>
  updateAppSettings('threeD', { droneRadius });

export const setDroneModel = (droneModel: DroneModelType) =>
  updateAppSettings('threeD', { droneModel });

export const setLanguage = (language: string) =>
  updateAppSettings('general', { language });

export const setScenery = (scenery: SceneryType) =>
  updateAppSettings('threeD', { scenery });

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

export const toggleLabels = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { showLabels } = state.settings.threeD;

  dispatch(updateAppSettings('threeD', { showLabels: !showLabels }));
};

export const toggleYaw = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { showYaw } = state.settings.threeD;

  dispatch(updateAppSettings('threeD', { showYaw: !showYaw }));
};

export const toggleScaleLabels = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { scaleLabels } = state.settings.threeD;

  dispatch(updateAppSettings('threeD', { scaleLabels: !scaleLabels }));
};
