import get from 'lodash-es/get';

import {
  getPerspectiveCamerasAndDefaultCamera,
  isShowIndoor,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

/**
 * Returns the effective scenery to show, depending on the user's preference and
 * the type of the show that is loaded.
 */
export const getEffectiveScenery = (
  state: RootState
): 'disabled' | 'day' | 'night' | 'indoor' => {
  const scenery: 'disabled' | 'day' | 'night' | 'indoor' | 'auto' =
    get(state, 'settings.threeD.scenery') || 'auto';

  if (scenery === 'auto') {
    return isShowIndoor(state) ? 'indoor' : 'night';
  }

  return scenery;
};

/**
 * Selector that returns the radius that should be used for the drones in the
 * 3D view.
 */
export const getPreferredDroneRadius = (state: RootState): number =>
  isShowIndoor(state) ? 0.15 : 0.75;

/**
 * Selector that returns the index of the currently selected camera.
 */
export const getSelectedCameraIndex = (state: RootState): number =>
  (get(state, 'threeD.camera.selectedIndex') as number) || 0;

/**
 * Selector that returns the currently selected camera or undefined if no
 * camera is selected.
 */
export const getSelectedCamera = (state: RootState) => {
  const index = getSelectedCameraIndex(state);
  const cameras = getPerspectiveCamerasAndDefaultCamera(state);
  return Array.isArray(cameras) && index >= 0 ? cameras[index] : undefined;
};
