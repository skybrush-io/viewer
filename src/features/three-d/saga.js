import React from 'react';
import { select, take } from 'redux-saga/effects';

import {
  skybrushToThreeJsPosition,
  skybrushToThreeJsQuaternion,
} from '~/utils/spatial';

import { getSelectedCamera } from './selectors';
import { switchToSelectedCamera } from './slice';

export const cameraRef = React.createRef();

/**
 * Saga that listens for switchToSelectedCamera actions and animates the 3D view
 * to the appropriate camera.
 */
export default function* cameraAnimatorSaga() {
  while (true) {
    yield take(switchToSelectedCamera.toString());
    const camera = yield select(getSelectedCamera);

    if (camera && cameraRef.current) {
      const components = cameraRef.current.components;
      const cameraControl = components
        ? components['advanced-camera-controls']
        : null;
      const { position, orientation } = camera;

      if (Array.isArray(position) && position.length >= 3) {
        const target = { position: skybrushToThreeJsPosition(position) };

        if (Array.isArray(orientation) && orientation.length >= 4) {
          target.quaternion = skybrushToThreeJsQuaternion(orientation);
        }

        if (cameraControl) {
          cameraControl.startTransitionTo(target);
        }
      }
    }
  }
}
