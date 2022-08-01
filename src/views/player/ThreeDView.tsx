/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import config from 'config';

import React from 'react';
import { connect } from 'react-redux';

import '~/aframe';

import { objectToString } from '@skybrush/aframe-components';
import type {
  ThreeJsPosition,
  ThreeJsRotation,
} from '@skybrush/aframe-components/lib/spatial';

import {
  getEffectiveScenery,
  getPreferredDroneRadius,
} from '~/features/three-d/selectors';
import {
  getInitialCameraConfigurationOfShow,
  getLoadedShowId,
  getNumberOfDronesInShow,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import CoordinateSystemAxes from './CoordinateSystemAxes';
import Scenery from './Scenery';
import type { SceneryType } from './Scenery';

import glow from '~/../assets/img/sphere-glow-hollow.png';
// const flapperDrone = require('~/../assets/models/flapper-drone.obj').default;

interface ThreeDViewProps {
  axes: boolean;
  cameraConfiguration: {
    position: ThreeJsPosition;
    rotation: ThreeJsRotation;
  };
  cameraRef: React.RefObject<HTMLElement>;
  droneSize: number;
  grid: boolean | string;
  navigation: {
    mode: 'walk' | 'fly';
    parameters: any;
  };
  numDrones: number;
  scaleLabels: boolean;
  scenery: SceneryType;
  showId: number;
  showLabels: boolean;
  showStatistics: boolean;
  vrEnabled?: boolean;
}

const DEFAULT_CAMERA_CONFIGURATION = {
  position: [0, 20, 50],
  rotation: [0, 0, 0],
};

const ThreeDView = React.forwardRef((props: ThreeDViewProps, ref) => {
  const {
    axes,
    cameraConfiguration = DEFAULT_CAMERA_CONFIGURATION,
    cameraRef,
    droneSize,
    grid,
    navigation,
    numDrones,
    scaleLabels,
    scenery,
    showId,
    showLabels,
    showStatistics,
    vrEnabled,
  } = props;

  const extraCameraProps = {
    'look-controls': objectToString({
      enabled: false,
    }),
    'wasd-controls': objectToString({
      enabled: false,
    }),
    'advanced-camera-controls': objectToString({
      acceptsKeyboardEvent: 'notEditable',
      fly: navigation && navigation.mode === 'fly',
      minAltitude: 0.5,
      reverseMouseDrag: true,
    }),
  };
  const extraSceneProps: Record<string, string> = {};
  const isLightScenery = scenery === 'day';

  if (showStatistics) {
    extraSceneProps.stats = 'true';
  }

  extraSceneProps['vr-mode-ui'] = config.modes.vr
    ? 'enabled: true; enterVRButton: #vr-button'
    : 'enabled: false';

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

      <a-camera
        key={`camera-${showId}`}
        ref={cameraRef}
        sync-pose-with-store=''
        id='three-d-camera'
        position={cameraConfiguration.position.join(' ')}
        rotation={cameraConfiguration.rotation.join(' ')}
        {...extraCameraProps}
      />

      <a-entity rotation='-90 0 90'>
        {axes && <CoordinateSystemAxes length={10} lineWidth={10} />}
        <a-drone-flock
          drone-size={droneSize}
          label-color={isLightScenery ? 'black' : 'white'}
          scale-labels={scaleLabels}
          show-glow={!isLightScenery}
          show-labels={showLabels}
          size={numDrones}
        />
      </a-entity>

      <Scenery type={scenery} grid={grid} />
    </a-scene>
  );
});

export default connect(
  // mapStateToProps
  (state: RootState) => ({
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
