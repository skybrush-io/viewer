import {
  skybrushRotationToQuaternion,
  type Pose,
} from '@skybrush/aframe-components/spatial';
import type { Camera } from '@skybrush/show-format';
import type { ShowDataSource } from './types';

export const DEFAULT_CAMERA_ORIENTATION = skybrushRotationToQuaternion([
  90, 0, -90,
]);

/**
 * Returns the pose of a Skybrush camera, replacing missing components with
 * reasonable defaults.
 *
 * The result is returned in Skybrush conventions.
 */
export function getCameraPose(camera: Camera): Pose {
  return {
    position: camera.position ?? [0, 0, 0],
    orientation: camera.orientation ?? DEFAULT_CAMERA_ORIENTATION,
  };
}

/**
 * Returns whether a show data source is reloadable.
 */
export function isShowDataSourceReloadable(
  source: ShowDataSource | null | undefined
): boolean {
  return source?.type === 'file';
}
