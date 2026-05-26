import config from 'config';

import { DEFAULT_DRONE_MODEL, DEFAULT_PLAYBACK_FPS } from '~/constants';
import type { RootState } from '~/store';
import { isSupportedFrameRate } from '../playback/types';
import type { TerrainSettings } from './types';

export const shouldShowPlaybackHintButton = () => config.buttons.playbackHint;
export const shouldUseWelcomeScreen = () => config.useWelcomeScreen;

export const getDroneModel = (state: RootState) =>
  state.settings.threeD.droneModel ?? DEFAULT_DRONE_MODEL;

export const getRawDroneRadiusSetting = (state: RootState) => {
  return state.settings.threeD.droneRadius ?? 1;
};

export const getLanguage = (state: RootState) =>
  state.settings.general?.language ?? config.language.default;

export const getScenery = (state: RootState) => state.settings.threeD.scenery;

export const getTerrainSettings = (state: RootState): TerrainSettings =>
  state.settings.threeD.terrain ?? { mode: 'disabled', tilesetUrl: '', token: '', cesiumAssetId: 0, googleMapsToken: '', cesiumIonToken: '' };

export const getSimulatedPlaybackFrameRate = (state: RootState) => {
  const fps = state.settings.playback?.fps ?? DEFAULT_PLAYBACK_FPS;
  return isSupportedFrameRate(fps) ? fps : DEFAULT_PLAYBACK_FPS;
};

export const getPlaybackSliderStepSize = (state: RootState) =>
  1 / getSimulatedPlaybackFrameRate(state);
