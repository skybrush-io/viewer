import get from 'lodash-es/get';

import {
  getShowEnvironmentType,
  isShowIndoor,
} from '~/features/show/selectors';

const INITIAL_CAMERA_CONFIGURATIONS = {
  indoor: {
    position: [0, 2, 10],
    rotation: [0, 0, 0],
  },
  outdoor: {
    position: [0, 20, 50], // [-52.9, 9.93, 0.22],
    rotation: [0, 0, 0], // [0, -114.6, 0]
  },
};

/**
 * Returns the effective scenery to show, depending on the user's preference and
 * the type of the show that is loaded.
 */
export const getEffectiveScenery = (state) => {
  const scenery = get(state, 'settings.threeD.scenery') || 'auto';

  if (scenery === 'auto') {
    return isShowIndoor(state) ? 'indoor' : 'night';
  }

  return scenery;
};

/**
 * Returns the initial configuration of the camera in the drone show.
 */
export const getInitialCameraConfigurationOfShow = (state) =>
  INITIAL_CAMERA_CONFIGURATIONS[getShowEnvironmentType(state)] ||
  INITIAL_CAMERA_CONFIGURATIONS.outdoor;

/**
 * Selector that returns the radius that should be used for the drones in the
 * 3D view.
 */
export const getPreferredDroneRadius = (state) =>
  isShowIndoor(state) ? 0.15 : 0.75;
