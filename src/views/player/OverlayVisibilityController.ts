import type React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMouseHovered, useTimeout } from 'react-use';

import {
  setOverlayHidden,
  setOverlayVisible,
} from '~/features/three-d/actions';

// import React from 'react';

interface UseMouseMovingStateOptions {
  onStarted?: () => void;
  onStopped?: () => void;
  timeout?: number;
}

const useMouseMovingState = (
  areaRef: React.RefObject<Element>,
  { onStarted, onStopped, timeout = 3000 }: UseMouseMovingStateOptions = {}
) => {
  const [moving, setMoving] = useState(false);
  const [lastPosition, setLastPosition] = useState([0, 0]);

  const [isReady, , reset] = useTimeout(timeout);
  const hasTimerFired = isReady();

  const { docX, docY } = useMouseHovered(areaRef, { whenHovered: true });

  useEffect(() => {
    if (lastPosition[0] === docX && lastPosition[1] === docY) {
      if (hasTimerFired && moving) {
        setMoving(false);
        if (onStopped) {
          onStopped();
        }
      }
    } else {
      setLastPosition([docX, docY]);
      reset();

      if (!moving) {
        setMoving(true);
        if (onStarted) {
          onStarted();
        }
      }
    }
  }, [
    docX,
    docY,
    hasTimerFired,
    lastPosition,
    moving,
    onStarted,
    onStopped,
    reset,
  ]);

  return moving;
};

interface OverlayVisibilityControllerProps {
  readonly areaRef: React.RefObject<Element>;
  readonly onHide?: () => void;
  readonly onShow?: () => void;
  readonly timeout?: number;
}

/**
 * Component that renders nothing but tracks mouse movements within the given
 * DOM node, and controls the visibility of an overlay based on the mouse move
 * events.
 *
 * Basically, when the mouse is moved, the overlay is set to visible. When the
 * mouse stops moving or leaves the overlay area, and it stays so for a given
 * timeout, the overlay is hidden.
 */
const OverlayVisibilityController = ({
  areaRef,
  onHide,
  onShow,
  timeout = 3000,
}: OverlayVisibilityControllerProps) => {
  useMouseMovingState(areaRef, {
    onStarted: onShow,
    onStopped: onHide,
    timeout,
  });

  // TODO(ntamas): if mouse is down, make sure that the overlay stays visible
  // until the mouse button is released

  return null;
};

export default connect(
  // mapStateToProps
  () => ({}),
  // mapDispatchToProps
  {
    onHide: setOverlayHidden,
    onShow: setOverlayVisible,
  }
)(OverlayVisibilityController);
