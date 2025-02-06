import { SCENE_CAMERA_ID } from './constants';

/**
 * Finds the camera in the scene.
 */
export function findSceneCamera(): any {
  const el = document.querySelector(`#${SCENE_CAMERA_ID}`);
  const cameraEl: any = el?.tagName === 'A-CAMERA' ? el : null;
  return cameraEl?.object3D;
}
