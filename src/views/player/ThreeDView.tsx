/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import config from 'config';

import type { Entity } from 'aframe';
import type React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '~/aframe';

import { objectToString } from '@skybrush/aframe-components';
import type {
  ThreeJsPositionTuple,
  ThreeJsRotationTuple,
} from '@skybrush/aframe-components/spatial';

import { getDroneModel } from '~/features/settings/selectors';
import type { DroneModelType, TerrainSettings } from '~/features/settings/types';
import {
  getLoadedShowId,
  getNumberOfDronesInShow,
  getShowLocation,
} from '~/features/show/selectors';
import type { Location } from '@skybrush/show-format';
import {
  getEffectiveDroneRadius,
  getEffectiveScenery,
  getInitialThreeJsCameraConfiguration,
} from '~/features/three-d/selectors';
import type { RootState } from '~/store';

import { SCENE_CAMERA_ID, SELECTABLE_OBJECT_CLASS } from './constants';
import CoordinateSystemAxes from './CoordinateSystemAxes';
import Scenery, { type SceneryType } from './Scenery';
import SelectionMarkers from './SelectionMarkers';

import flapperDroneModel from '~/../assets/models/flapper-drone.obj';
import quadcopterModel from '~/../assets/models/quadcopter.obj';

type ThreeDViewProps = {
  readonly axes: boolean;
  readonly cameraConfiguration: {
    position: ThreeJsPositionTuple;
    rotation: ThreeJsRotationTuple;
  };
  readonly cameraRef: React.RefObject<Entity | null>;
  readonly droneModel: DroneModelType;
  readonly droneRadius: number;
  readonly grid: boolean | string;
  readonly navigation: {
    mode: 'walk' | 'fly';
    parameters: any;
  };
  readonly numDrones: number;
  readonly ref?: React.Ref<HTMLElement>;
  readonly scaleLabels: boolean;
  readonly scenery: SceneryType;
  readonly showId: number;
  readonly showLabels: boolean;
  readonly showStatistics: boolean;
  readonly showYaw: boolean;
  readonly vrEnabled?: boolean;
  readonly location?: Location;
  readonly terrain: TerrainSettings;
};

const DEFAULT_CAMERA_CONFIGURATION = {
  position: [0, 20, 50],
  rotation: [0, 0, 0],
};

const DEFAULT_TERRAIN_SETTINGS: TerrainSettings = {
  mode: 'disabled',
  tilesetUrl: '',
  token: '',
  cesiumAssetId: 0,
};

const ThreeDView = (props: ThreeDViewProps) => {
  const {
    axes,
    cameraConfiguration = DEFAULT_CAMERA_CONFIGURATION,
    cameraRef,
    droneModel,
    droneRadius,
    grid,
    location,
    navigation,
    numDrones,
    ref,
    scaleLabels,
    scenery,
    showId,
    showLabels,
    showStatistics,
    showYaw,
    terrain = DEFAULT_TERRAIN_SETTINGS,
    vrEnabled,
  } = props;

  const [cameraId, setCameraId] = useState(0);

  const terrainEnabled = terrain.mode === 'enabled' && !!location;
  const terrainOrigin = location?.origin;
  const terrainLat = terrainOrigin?.[0] ?? 0;
  const terrainLon = terrainOrigin?.[1] ?? 0;
  const terrainAlt = terrainOrigin?.[2] ?? 0;
  const terrainOrientation = location?.orientation ?? 0;

  if (terrain.mode === 'enabled' && !location) {
    console.info(
      'Terrain mode enabled but show has no geodetic location; disabling terrain rendering.'
    );
  }

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
  const isLightScenery = scenery === 'day' && !terrainEnabled;
  const isSceneryEnabled = scenery !== 'disabled' && !terrainEnabled;

  if (showStatistics) {
    extraSceneProps.stats = 'true';
  }

  extraSceneProps['xr-mode-ui'] = config.modes.vr
    ? 'enabled: true; enterVRButton: #vr-button'
    : 'enabled: false';

  if (!isSceneryEnabled) {
    extraSceneProps.background = 'color: black';
  }

  // Updating the camera is tricky. We need to reset the camera position and
  // rotation to the one prescribed by its props whenever the user loads a
  // new show. The easiest way to achieve this is to assign a new key to the
  // camera whenever a new show is loaded because this would unmount the old
  // camera and mount a new one. However, we must _not_ unmount the camera
  // when the scene is still loading, because it would cause the loading screen
  // of the scene to get stuck. This is easy to trigger in Firefox, a bit harder
  // in Chrome, but it's still a problem in both cases. That's why we need a
  // separate cameraId and sceneLoaded state
  useEffect(() => {
    if (showId !== cameraId && cameraRef.current?.sceneEl?.hasLoaded) {
      setCameraId(showId);
    }
  }, [cameraId, cameraRef, showId]);

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
        <a-asset-item id='flapper-drone' src={flapperDroneModel} />
        <a-asset-item id='quadcopter' src={quadcopterModel} />
      </a-assets>

      <a-camera
        key={`camera-${cameraId}`}
        ref={cameraRef}
        id={SCENE_CAMERA_ID}
        position={cameraConfiguration.position.join(' ')}
        rotation={cameraConfiguration.rotation.join(' ')}
        {...extraCameraProps}
      >
        <a-entity
          cursor='rayOrigin: mouse'
          raycaster={`objects: .${SELECTABLE_OBJECT_CLASS}; interval: 100`}
        />
      </a-camera>

      <a-entity rotation='-90 0 90'>
        {axes && <CoordinateSystemAxes length={10} lineWidth={10} />}
        {/* Watch out for the handling of Boolean props below: they need to be
         * passed to AFrame components as strings! */}
        <a-drone-flock
          drone-model={droneModel}
          drone-radius={droneRadius}
          label-color={isLightScenery ? 'black' : 'white'}
          scale-labels={String(!!scaleLabels)}
          show-glow={String(!isLightScenery)}
          show-labels={String(!!showLabels)}
          show-yaw={String(!!showYaw)}
          size={numDrones}
        />
        <SelectionMarkers />
        {terrainEnabled && (
          <a-entity
            key={`terrain-${showId}`}
            terrain-tiles={objectToString({
              url: terrain.tilesetUrl,
              token: terrain.token,
              cesiumAssetId: terrain.cesiumAssetId,
              originLat: terrainLat,
              originLon: terrainLon,
              originAlt: terrainAlt,
              orientation: terrainOrientation,
            })}
          />
        )}
        {/* <VelocityArrows /> */}
      </a-entity>

      {!terrainEnabled && <Scenery type={scenery} grid={grid} />}
    </a-scene>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    cameraConfiguration: getInitialThreeJsCameraConfiguration(state),
    numDrones: getNumberOfDronesInShow(state),
    showId: getLoadedShowId(state),
    ...state.settings.threeD,
    ...state.threeD,
    droneModel: getDroneModel(state),
    droneRadius: getEffectiveDroneRadius(state),
    scenery: getEffectiveScenery(state),
    location: getShowLocation(state),
  }),
  // mapDispatchToProps
  {},
  // mergeProps
  null,
  { forwardRef: true }
)(ThreeDView);
