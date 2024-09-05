import config from 'config';
import { DEFAULT_DRONE_MODEL } from '~/constants';
import type { RootState } from '~/store';

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
