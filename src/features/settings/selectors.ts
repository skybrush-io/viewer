import config from 'config';
import {
  DEFAULT_DRONE_MODEL,
  DEFAULT_DRONE_RADIUS,
  INDOOR_DRONE_SIZE_SCALING_FACTOR,
} from '~/constants';
import type { RootState } from '~/store';

export const shouldShowPlaybackHintButton = () => config.buttons.playbackHint;
export const shouldUseWelcomeScreen = () => config.useWelcomeScreen;

export const getDroneModel = (state: RootState) =>
  state.settings.threeD.droneModel ?? DEFAULT_DRONE_MODEL;

export const getDroneRadius = (state: RootState, indoor = false) => {
  const settings = state.settings.threeD;
  return (
    (indoor
      ? settings.indoorDroneSizeScalingFactor ??
        INDOOR_DRONE_SIZE_SCALING_FACTOR
      : 1) * (settings.droneRadius ?? DEFAULT_DRONE_RADIUS)
  );
};

export const getScenery = (state: RootState) => state.settings.threeD.scenery;
