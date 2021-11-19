import React from 'react';
import { select, take } from 'redux-saga/effects';

import {
  skybrushToThreeJsPosition,
  skybrushToThreeJsQuaternion,
} from '@skybrush/aframe-components/lib/spatial';

import { getSelectedCamera } from './selectors';
import { rotateViewTowards, switchToSelectedCamera } from './slice';

export const cameraRef = React.createRef();

/**
 * Saga that listens for switchToSelectedCamera actions and animates the 3D view
 * to the appropriate camera.
 */
export default function* cameraAnimatorSaga() {
  const SWITCH_TO_SELECTED_CAMERA = switchToSelectedCamera.toString();
  const ROTATE_VIEW_TOWARDS = rotateViewTowards.toString();

  while (true) {
    const action = yield take([SWITCH_TO_SELECTED_CAMERA, ROTATE_VIEW_TOWARDS]);

    switch (action.type) {
      case SWITCH_TO_SELECTED_CAMERA:
        handleCameraSwitch(yield select(getSelectedCamera));
        break;

      case ROTATE_VIEW_TOWARDS:
        handleViewRotationTowards(action.payload);
        break;

      default:
        break;
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

function handleCameraSwitch(camera) {
  const controller = getCameraController();
  if (camera && controller) {
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

function handleViewRotationTowards(point) {
  const controller = getCameraController();
  if (controller) {
    const target = { lookAt: skybrushToThreeJsPosition(point) };
    controller.startTransitionTo(target);
  }
}
