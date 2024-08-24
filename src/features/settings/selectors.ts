import config from 'config';
import {
  DEFAULT_DRONE_RADIUS,
  INDOOR_DRONE_SIZE_SCALING_FACTOR,
} from '~/constants';
import type { RootState } from '~/store';

export const shouldShowPlaybackHintButton = () => config.buttons.playbackHint;
export const shouldUseWelcomeScreen = () => config.useWelcomeScreen;

export const getDroneSize = (state: RootState, indoor = false) => {
  const settings = state.settings.threeD;
  return (
    (indoor
      ? settings.indoorDroneSizeScalingFactor ??
        INDOOR_DRONE_SIZE_SCALING_FACTOR
      : 1) * (settings.droneSize ?? DEFAULT_DRONE_RADIUS)
  );
};

export const getScenery = (state: RootState) => state.settings.threeD.scenery;
