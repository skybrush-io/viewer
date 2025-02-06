import {
  skybrushRotationToQuaternion,
  type Pose,
} from '@skybrush/aframe-components/lib/spatial';
import type { Camera } from '@skybrush/show-format';

export const DEFAULT_CAMERA_ORIENTATION = skybrushRotationToQuaternion([
  90, 0, -90,
]);

/**
 * Returns the pose of a camera, replacing missing components with reasonable
 * defaults.
 */
export function getCameraPose(camera: Camera): Pose {
  return {
    position: camera.position ?? [0, 0, 0],
    orientation: camera.orientation ?? DEFAULT_CAMERA_ORIENTATION,
  };
}
