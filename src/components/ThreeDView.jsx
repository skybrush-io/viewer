/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Scenery from './Scenery';

// eslint-disable-next-line no-unused-vars
import AFrame from '~/aframe';
import { objectToString } from '~/aframe/utils';

const images = {
  glow: 'assets/img/sphere-glow-hollow.png'
};

const ThreeDView = React.forwardRef((props, ref) => {
  const { grid, navigation, scenery, showStatistics, vrEnabled } = props;

  const extraCameraProps = {
    'altitude-control': objectToString({
      enabled: true
    }),
    'better-wasd-controls': objectToString({
      fly: navigation && navigation.mode === 'fly'
    }),
    'wasd-controls': objectToString({
      enabled: false
    })
  };
  const extraSceneProps = {};

  if (showStatistics) {
    extraSceneProps.stats = 'true';
  }

  return (
    <a-scene
      ref={ref}
      deallocate
      vr-mode-ui="enabled: false"
      keyboard-shortcuts={objectToString({ enterVR: vrEnabled })}
      loading-screen="backgroundColor: #444; dotsColor: #888"
      renderer="antialias: false"
      {...extraSceneProps}
    >
      <a-assets>
        <img crossOrigin="anonymous" id="glow-texture" src={images.glow} />
      </a-assets>

      <a-camera
        sync-pose-with-store=""
        id="three-d-camera"
        look-controls="reverseMouseDrag: true"
        {...extraCameraProps}
      >
        <a-entity
          cursor="rayOrigin: mouse"
          raycaster="objects: .three-d-clickable; interval: 100"
        />
      </a-camera>

      <a-entity rotation="-90 0 90">
        <a-drone-flock />
      </a-entity>

      <Scenery scale={10} type={scenery} grid={grid} />
    </a-scene>
  );
});

ThreeDView.propTypes = {
  grid: PropTypes.string,
  isCoordinateSystemLeftHanded: PropTypes.bool,
  navigation: PropTypes.shape({
    mode: PropTypes.oneOf(['walk', 'fly']),
    parameters: PropTypes.object
  }),
  scenery: PropTypes.string,
  showAxes: PropTypes.bool,
  showHomePositions: PropTypes.bool,
  showLandingPositions: PropTypes.bool,
  showStatistics: PropTypes.bool,
  vrEnabled: PropTypes.bool
};

export default connect(
  // mapStateToProps
  state => ({
    ...state.threeD
  }),
  // mapDispatchToProps
  {},
  // mergeProps
  null,
  { forwardRef: true }
)(ThreeDView);
