import React from 'react';
import { put, select, take } from 'redux-saga/effects';

import {
  skybrushToThreeJsPosition,
  skybrushToThreeJsQuaternion,
  threeJsToSkybrushPose,
  type Pose,
  type ThreeJsPositionTuple,
  type ThreeJsQuaternionTuple,
} from '@skybrush/aframe-components/lib/spatial';
import type { Camera, Vector3Tuple } from '@skybrush/show-format';

import { getSelectedCamera } from './selectors';
import {
  overrideCameraPose,
  rememberCameraPose,
  resetZoom,
  rotateViewTowards,
  switchToCameraPose,
  switchToSelectedCamera,
} from './slice';

export const cameraRef = React.createRef<any>();

interface CameraTarget {
  lookAt?: ThreeJsPositionTuple;
  position?: ThreeJsPositionTuple;
  quaternion?: ThreeJsQuaternionTuple;
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
  const REMEMBER_CAMERA_POSE = rememberCameraPose.toString();
  const RESET_ZOOM = resetZoom.toString();
  const ROTATE_VIEW_TOWARDS = rotateViewTowards.toString();
  const SWITCH_TO_CAMERA_POSE = switchToCameraPose.toString();
  const SWITCH_TO_SELECTED_CAMERA = switchToSelectedCamera.toString();

  while (true) {
    const action = yield take([
      REMEMBER_CAMERA_POSE,
      RESET_ZOOM,
      ROTATE_VIEW_TOWARDS,
      SWITCH_TO_CAMERA_POSE,
      SWITCH_TO_SELECTED_CAMERA,
    ]);
    const controller = getCameraController();
    let camera: ReturnType<typeof getSelectedCamera>;

    if (controller) {
      switch (action.type) {
        case REMEMBER_CAMERA_POSE:
          const response = handleRememberCameraPose(controller);
          if (response) {
            yield put(response as any);
          }
          break;

        case RESET_ZOOM:
          handleResetZoom(controller);
          break;

        case SWITCH_TO_CAMERA_POSE:
          handleCameraSwitch(controller, action.payload as Pose);
          break;

        case SWITCH_TO_SELECTED_CAMERA:
          camera = yield select(getSelectedCamera);
          handleCameraSwitch(controller, camera);
          break;

        case ROTATE_VIEW_TOWARDS:
          if (Array.isArray(action.payload) && action.payload.length >= 3) {
            handleViewRotationTowards(
              controller,
              action.payload as Vector3Tuple
            );
          }

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
  pose: Pose | Camera | undefined
) {
  if (pose) {
    const { position, orientation } = pose;

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

function handleRememberCameraPose(controller: CameraController) {
  const cameraObj = cameraRef.current?.object3D;
  if (cameraObj) {
    return overrideCameraPose(
      threeJsToSkybrushPose({
        position: cameraObj.position.toArray(),
        rotation: cameraObj.rotation
          .reorder('YZX')
          .toArray()
          .slice(0, 3)
          .map((x: number) => x * (180 / Math.PI)),
      })
    );
  } else {
    return undefined;
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
