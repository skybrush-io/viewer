import {
  skybrushRotationToQuaternion,
  type Pose,
} from '@skybrush/aframe-components/spatial';
import type { Camera, QuaternionWXYZTuple } from '@skybrush/show-format';
import type { ShowDataSource } from './types';
import * as THREE from 'three';

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

/**
 * Converts a Skybrush (show-space) quaternion WXYZ to A-Frame Euler
 * degrees in YXZ order, without remapping axes to Three.js world space.
 */
export function skybrushQuaternionToEulerDegrees(
  wxyz: QuaternionWXYZTuple
): [number, number, number] {
  const quat = new THREE.Quaternion(wxyz[1], wxyz[2], wxyz[3], wxyz[0]);
  const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ');
  const { radToDeg } = THREE.MathUtils;
  return [radToDeg(euler.x), radToDeg(euler.y), radToDeg(euler.z)];
}