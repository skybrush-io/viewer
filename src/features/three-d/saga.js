import React from 'react';
import { select, take } from 'redux-saga/effects';

import {
  skybrushToThreeJsPosition,
  skybrushToThreeJsQuaternion,
} from '@skybrush/aframe-components/lib/spatial';

import { getSelectedCamera } from './selectors';
import { resetZoom, rotateViewTowards, switchToSelectedCamera } from './slice';

export const cameraRef = React.createRef();

/**
 * Saga that listens for switchToSelectedCamera actions and animates the 3D view
 * to the appropriate camera.
 */
export default function* cameraAnimatorSaga() {
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
    if (controller) {
      switch (action.type) {
        case RESET_ZOOM:
          handleResetZoom(controller);
          break;

        case SWITCH_TO_SELECTED_CAMERA:
          handleCameraSwitch(controller, yield select(getSelectedCamera));
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

function getCameraController() {
  if (cameraRef.current) {
    const components = cameraRef.current.components;
    return components ? components['advanced-camera-controls'] : null;
  }

  return null;
}

function handleCameraSwitch(controller, camera) {
  if (camera) {
    const { position, orientation } = camera;

    if (Array.isArray(position) && position.length >= 3) {
      const target = { position: skybrushToThreeJsPosition(position) };

      if (Array.isArray(orientation) && orientation.length >= 4) {
        target.quaternion = skybrushToThreeJsQuaternion(orientation);
      }

      controller.startTransitionTo(target);
    }
  }
}

function handleResetZoom(controller) {
  controller.resetZoom();
}

function handleViewRotationTowards(controller, point) {
  const target = { lookAt: skybrushToThreeJsPosition(point) };
  controller.startTransitionTo(target);
}
