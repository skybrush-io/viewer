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
import {
  getInitialCameraConfigurationOfShow,
  getNumberOfDronesInShow
} from '~/features/show/selectors';

const glow = require('~/../assets/img/sphere-glow-hollow.png').default;
// const flapperDrone = require('~/../assets/models/flapper-drone.obj').default;

const ThreeDView = React.forwardRef((props, ref) => {
  const {
    cameraConfiguration,
    grid,
    navigation,
    numDrones,
    scenery,
    showStatistics,
    vrEnabled
  } = props;

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
      vr-mode-ui="enabled: true; enterVRButton: #vr-button"
      keyboard-shortcuts={objectToString({ enterVR: vrEnabled })}
      loading-screen="backgroundColor: #444; dotsColor: #888"
      renderer="antialias: false"
      {...extraSceneProps}
    >
      <a-assets>
        <img crossOrigin="anonymous" id="glow-texture" src={glow} />
        {/* <a-asset-item id="flapper" src={flapperDrone} /> */}
      </a-assets>

      <a-entity
        id="camera-rig"
        position={cameraConfiguration.position.join(' ')} // "-52.9 9.93 0.22"
        rotation={cameraConfiguration.rotation.join(' ')} // "-24.63 -114.6 0"
      >
        <a-camera
          sync-pose-with-store=""
          id="three-d-camera"
          look-controls="reverseMouseDrag: true"
          {...extraCameraProps}
        />
      </a-entity>

      <a-entity rotation="-90 0 90">
        <a-drone-flock drone-size={1.5} size={numDrones} />
      </a-entity>

      <Scenery scale={10} type={scenery} grid={grid} />
    </a-scene>
  );
});

ThreeDView.propTypes = {
  cameraConfiguration: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    rotation: PropTypes.arrayOf(PropTypes.number).isRequired
  }),
  grid: PropTypes.string,
  navigation: PropTypes.shape({
    mode: PropTypes.oneOf(['walk', 'fly']),
    parameters: PropTypes.object
  }),
  numDrones: PropTypes.number,
  scenery: PropTypes.string,
  showStatistics: PropTypes.bool,
  vrEnabled: PropTypes.bool
};

ThreeDView.defaultProps = {
  cameraConfiguration: {
    position: [0, 20, 50],
    rotation: [0, 0, 0]
  }
};

export default connect(
  // mapStateToProps
  state => ({
    cameraConfiguration: getInitialCameraConfigurationOfShow(state),
    numDrones: getNumberOfDronesInShow(state),
    ...state.settings.threeD,
    ...state.threeD
  }),
  // mapDispatchToProps
  {},
  // mergeProps
  null,
  { forwardRef: true }
)(ThreeDView);
