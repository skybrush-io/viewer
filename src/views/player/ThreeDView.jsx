/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import config from 'config';

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Scenery from './Scenery';

// eslint-disable-next-line no-unused-vars
import AFrame from '~/aframe';
import { objectToString } from '@skybrush/aframe-components';
import {
  getEffectiveScenery,
  getInitialCameraConfigurationOfShow,
  getPreferredDroneRadius,
} from '~/features/three-d/selectors';
import {
  getLoadedShowId,
  getNumberOfDronesInShow,
} from '~/features/show/selectors';
import CoordinateSystemAxes from './CoordinateSystemAxes';

import glow from '~/../assets/img/sphere-glow-hollow.png';
// const flapperDrone = require('~/../assets/models/flapper-drone.obj').default;

const ThreeDView = React.forwardRef((props, ref) => {
  const {
    axes,
    cameraConfiguration,
    droneSize,
    grid,
    navigation,
    numDrones,
    scenery,
    showId,
    showStatistics,
    vrEnabled,
  } = props;

  const extraCameraProps = {
    'altitude-control': objectToString({
      enabled: true,
      min: 0.01 - cameraConfiguration.position[1],
    }),
    'better-wasd-controls': objectToString({
      fly: navigation && navigation.mode === 'fly',
    }),
    'wasd-controls': objectToString({
      enabled: false,
    }),
  };
  const extraSceneProps = {};

  if (showStatistics) {
    extraSceneProps.stats = 'true';
  }

  extraSceneProps['vr-mode-ui'] = config.buttons.vr ? 'enabled: true; enterVRButton: #vr-button' : 'enabled: false';

  return (
    <a-scene
      ref={ref}
      deallocate
      keyboard-shortcuts={objectToString({ enterVR: vrEnabled })}
      loading-screen='backgroundColor: #444; dotsColor: #888'
      renderer='antialias: false'
      {...extraSceneProps}
    >
      <a-assets>
        <img crossOrigin='anonymous' id='glow-texture' src={glow} />
        {/* <a-asset-item id="flapper" src={flapperDrone} /> */}
      </a-assets>

      <a-entity
        key={`camera-rig-${showId}`}
        id='camera-rig'
        position={cameraConfiguration.position.join(' ')}
        rotation={cameraConfiguration.rotation.join(' ')}
      >
        <a-camera
          sync-pose-with-store=''
          id='three-d-camera'
          look-controls='reverseMouseDrag: true'
          {...extraCameraProps}
        />
      </a-entity>

      <a-entity rotation='-90 0 90'>
        {axes && <CoordinateSystemAxes length={10} lineWidth={10} />}
        <a-drone-flock drone-size={droneSize} size={numDrones} />
      </a-entity>

      <Scenery type={scenery} grid={grid} />
    </a-scene>
  );
});

ThreeDView.propTypes = {
  axes: PropTypes.bool,
  cameraConfiguration: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  droneSize: PropTypes.number,
  grid: PropTypes.string,
  navigation: PropTypes.shape({
    mode: PropTypes.oneOf(['walk', 'fly']),
    parameters: PropTypes.object,
  }),
  numDrones: PropTypes.number,
  scenery: PropTypes.oneOf(['day', 'night', 'indoor']),
  showId: PropTypes.number,
  showStatistics: PropTypes.bool,
  vrEnabled: PropTypes.bool,
};

ThreeDView.defaultProps = {
  cameraConfiguration: {
    position: [0, 20, 50],
    rotation: [0, 0, 0],
  },
};

export default connect(
  // mapStateToProps
  (state) => ({
    cameraConfiguration: getInitialCameraConfigurationOfShow(state),
    droneSize: getPreferredDroneRadius(state),
    numDrones: getNumberOfDronesInShow(state),
    showId: getLoadedShowId(state),
    ...state.settings.threeD,
    ...state.threeD,
    scenery: getEffectiveScenery(state),
  }),
  // mapDispatchToProps
  {},
  // mergeProps
  null,
  { forwardRef: true }
)(ThreeDView);
