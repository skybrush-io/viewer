import React from 'react';
import { select, take } from 'redux-saga/effects';

import {
  skybrushToThreeJsPosition,
  skybrushToThreeJsQuaternion,
  ThreeJsPosition,
  ThreeJsQuaternion,
} from '@skybrush/aframe-components/lib/spatial';
import { Camera, Vector3Tuple } from '@skybrush/show-format';

import { getSelectedCamera } from './selectors';
import { resetZoom, rotateViewTowards, switchToSelectedCamera } from './slice';

export const cameraRef = React.createRef<any>();

interface CameraTarget {
  lookAt?: ThreeJsPosition;
  position?: ThreeJsPosition;
  quaternion?: ThreeJsQuaternion;
}

interface CameraController {
  resetZoom: () => void;
  startTransitionTo: (target: CameraTarget) => void;
}

/**
 * Saga that listens for switchToSelectedCamera actions and animates the 3D view
 * to the appropriate camera.
 */
function* cameraAnimatorSaga(): Generator<any, void, any> {
  const RESET_ZOOM = resetZoom.toString();
  const ROTATE_VIEW_TOWARDS = rotateViewTowards.toString();
  const SWITCH_TO_SELECTED_CAMERA = switchToSelectedCamera.toString();

  while (true) {
    const action = yield take([
      RESET_ZOOM,
      ROTATE_VIEW_TOWARDS,
      SWITCH_TO_SELECTED_CAMERA,
    ]);
    const controller = getCameraController();
    let camera: ReturnType<typeof getSelectedCamera>;

    if (controller) {
      switch (action.type) {
        case RESET_ZOOM:
          handleResetZoom(controller);
          break;

        case SWITCH_TO_SELECTED_CAMERA:
          camera = yield select(getSelectedCamera);
          handleCameraSwitch(controller, camera);
          break;

        case ROTATE_VIEW_TOWARDS:
          handleViewRotationTowards(controller, action.payload);
          break;

        default:
          break;
      }
    }
  }
}

function getCameraController(): CameraController | undefined {
  if (cameraRef.current) {
    const components = cameraRef.current.components;
    return components
      ? (components['advanced-camera-controls'] as CameraController)
      : undefined;
  }
}

function handleCameraSwitch(
  controller: CameraController,
  camera: Camera | undefined
) {
  if (camera) {
    const { position, orientation } = camera;

    if (Array.isArray(position) && position.length >= 3) {
      const target: CameraTarget = {
        position: skybrushToThreeJsPosition(position),
      };

      if (Array.isArray(orientation) && orientation.length >= 4) {
        target.quaternion = skybrushToThreeJsQuaternion(orientation);
      }

      controller.startTransitionTo(target);
    }
  }
}

function handleResetZoom(controller: CameraController) {
  controller.resetZoom();
}

function handleViewRotationTowards(
  controller: CameraController,
  point: Vector3Tuple
) {
  const target = { lookAt: skybrushToThreeJsPosition(point) };
  controller.startTransitionTo(target);
}

export default cameraAnimatorSaga;
