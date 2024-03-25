/* eslint-disable @typescript-eslint/no-unsafe-return */
/* TODO(ntamas): remove it when we are done with TypeScript typing of shows */

import config from 'config';
import get from 'lodash-es/get';
import maxBy from 'lodash-es/maxBy';
import uniq from 'lodash-es/uniq';

import { createSelector } from '@reduxjs/toolkit';

import {
  skybrushRotationToQuaternion,
  skybrushQuaternionToThreeJsRotation,
  skybrushToThreeJsPosition,
} from '@skybrush/aframe-components/lib/spatial';
import {
  createLightProgramPlayer,
  createTrajectoryPlayer,
  createYawControlPlayer,
  getCamerasFromShowSpecification,
  validateTrajectory,
  validateYawControl,
  type Camera,
  type DroneSpecification,
  type ShowMetadata,
  type ShowSpecification,
  type Trajectory,
  type TrajectoryPlayer,
  type YawControl,
  CameraType,
} from '@skybrush/show-format';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import type { RootState } from '~/store';

export const canLoadShowFromLocalFile = (): boolean => config.io.localFiles;

const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJECT = Object.freeze({});
const DEFAULT_ORIENTATION = skybrushRotationToQuaternion([90, 0, -90]);
const DEFAULT_CAMERAS: Record<string, Camera[]> = {
  // Skybrush coordinate system: X points forward, Y points left, Z points up.
  // [0, 0, 0] rotation is when the camera points downwards (negative Z) and the
  // up-vector of the camera points towards left (positive Y). To have an upright
  // camera that looks towards the positive X axis, we need to rotate around
  // the world X axis by 90 degrees and then around the world Z axis by -90
  // degrees.
  indoor: [
    {
      name: 'Default view',
      position: [-10, 0, 2], // [0, 2, 10]
      orientation: DEFAULT_ORIENTATION,
      // don't set default: true here because then it would override the
      // cameras in the .skyc file if the .skyc file does not designate any
      // of the cameras as default
    },
  ],
  outdoor: [
    {
      name: 'Default view',
      position: [-50, 0, 20], // [0, 20, 50]
      orientation: DEFAULT_ORIENTATION,
    },
  ],
};

/**
 * Selector that returns the specification of the currently loaded show, or
 * undefined if no show is loaded.
 */
export const getShowSpecification = (state: RootState): ShowSpecification =>
  get(state, 'show.data');

/**
 * Selector that returns the timestamp offset of the show.
 *
 * Timestamp offsets are used when the currently loaded show comes from
 * Skybrush Studio and it contains only a part of the full trajectory. In
 * such cases, the timestamps in the show file are from T=0, but the metadata
 * of the show contains an offset value that should be used whenever a timestamp
 * is formatted on the UI.
 */
export const getTimestampDisplayOffset = createSelector(
  (state: RootState) => get(state, 'show.data.meta'),
  (meta): number => {
    const offset = meta ? meta.timestampOffset : 0;

    if (typeof offset === 'number' && Number.isFinite(offset)) {
      return offset;
    }

    return 0;
  }
);

/**
 * Selector that returns a function that is suitable for turning a timestamp
 * (expressed in nubmer of seconds) to a timestamp that can appear on the UI,
 * taking into account any timestamp offsets that may be configured in the
 * state store for the show.
 */
export const getTimestampFormatter = createSelector(
  getTimestampDisplayOffset,
  (offset): ((value: number) => string) => {
    return offset === 0
      ? formatPlaybackTimestamp
      : (value: number) => formatPlaybackTimestamp(value + offset);
  }
);

/**
 * Returns whether a trajectory object "looks like" a valid trajectory.
 */
export const isValidTrajectory = (
  trajectory: any
): trajectory is Trajectory => {
  try {
    validateTrajectory(trajectory);
    return true;
  } catch {
    return false;
  }
};

/**
 * Returns whether a trajectory object "looks like" a valid light program.
 */
export const isValidLightProgram = (program: any): boolean =>
  typeof program === 'object' &&
  program.version === 1 &&
  typeof program.data === 'string';

/**
 * Returns whether a yaw control object "looks like" valid yaw control data.
 */
export const isValidYawControl = (
  yawControl: any
): yawControl is YawControl => {
  try {
    validateYawControl(yawControl);
    return true;
  } catch {
    return false;
  }
};

/**
 * Returns the common show settings that apply to all drones in the currently
 * loaded show.
 */
export const getCommonShowSettings = (state: RootState) => {
  const result = get(state, 'show.data.settings');
  return typeof result === 'object' ? result : EMPTY_OBJECT;
};

/**
 * Returns the specification of the drone swarm in the currently loaded show.
 */
export const getDroneSwarmSpecification = (
  state: RootState
): DroneSpecification[] => {
  const result = get(state, 'show.data.swarm.drones');
  return Array.isArray(result)
    ? result
    : (EMPTY_ARRAY as any as DroneSpecification[]);
};

/**
 * Returns a unique ID for the currently loaded show so 3D components can
 * reset the camera position when a new show is loaded.
 */
export const getLoadedShowId = (state: RootState): number => state.show.id;

/**
 * Selector that returns the type of the show (indoor or outdoor).
 */
export const getShowEnvironmentType = (state: RootState): string =>
  get(state, 'show.data.environment.type') || 'outdoor';

/**
 * Selector that returns whether the show is indoor.
 */
export const isShowIndoor = (state: RootState) =>
  getShowEnvironmentType(state) === 'indoor';

/**
 * Selector that returns whether the show is outdoor.
 */
export const isShowOutdoor = (state: RootState) =>
  getShowEnvironmentType(state) === 'outdoor';

/**
 * Returns an array containing all the cameras from the show file,
 * or an empty array if the show has no cameras.
 */
export const getCameras = createSelector(
  getShowSpecification,
  (spec: ShowSpecification): Camera[] =>
    spec
      ? getCamerasFromShowSpecification(spec)
      : (EMPTY_ARRAY as any as Camera[])
);

/**
 * Returns an array containing all the perspective cameras from the show file,
 * or an empty array if the show has no perspective cameras.
 */
export const getPerspectiveCameras = createSelector(getCameras, (cameras) =>
  cameras && cameras.length > 0
    ? cameras
        .filter(
          (camera) =>
            camera && (!camera.type || camera.type === CameraType.PERSPECTIVE)
        )
        .map(
          (camera: Camera): Camera =>
            // Make sure that the camera has a minimum height of 1m otherwise it
            // would be placed below the ground if it is far from the center
            // (as we have hills in the scenery there)
            Array.isArray(camera.position) && camera.position[2] < 1
              ? {
                  ...camera,
                  position: [camera.position[0], camera.position[1], 1],
                }
              : camera
        )
    : (EMPTY_ARRAY as any as Camera[])
);

/**
 * Returns an array containing all the perspective cameras from the show file,
 * or at least a fake camera if the show file has no cameras.
 */
export const getPerspectiveCamerasAndDefaultCamera = createSelector(
  getPerspectiveCameras,
  getShowEnvironmentType,
  (cameras, type) => {
    const hasDefaultCamera = cameras.some((camera) => camera.default);
    return hasDefaultCamera ? cameras : [...DEFAULT_CAMERAS[type], ...cameras];
  }
);

/**
 * Returns the initial configuration of the camera in the drone show.
 */
export const getInitialCameraConfigurationOfShow = createSelector(
  getPerspectiveCamerasAndDefaultCamera,
  (cameras) => {
    let selectedCamera;

    // Assertion: cameras.length > 0
    for (const camera of cameras) {
      if (camera.default) {
        selectedCamera = camera;
        break;
      }
    }

    // eslint-disable-next-line logical-assignment-operators
    if (!selectedCamera) {
      // Assertion: first camera is always the "default camera" that was added
      // by us
      selectedCamera = cameras[0];
    }

    return {
      position: skybrushToThreeJsPosition(selectedCamera.position ?? [0, 0, 0]),
      rotation: skybrushQuaternionToThreeJsRotation(
        selectedCamera.orientation ?? DEFAULT_ORIENTATION
      ),
    };
  }
);

/**
 * Returns an array containing all the cues from the show file, or an empty
 * array if the show has no cues.
 */
export const getCues = (state: RootState) => {
  const cues = get(state, 'show.data.settings.cues.items');
  return Array.isArray(cues) ? cues : EMPTY_ARRAY;
};

/**
 * Returns an array containing all the light programs. The array will contain
 * undefined for all the drones that have no light programs in the mission.
 */
const getLightPrograms = createSelector(
  getDroneSwarmSpecification,
  (swarm: DroneSpecification[]) =>
    swarm.map((drone: DroneSpecification) => {
      const program = get(drone, 'settings.lights');
      return isValidLightProgram(program) ? program : undefined;
    })
);

/**
 * Returns an array containing light program player objects for all the
 * light programs.
 */
export const getLightProgramPlayers = createSelector(
  getLightPrograms,
  (lightPrograms) => lightPrograms.map(createLightProgramPlayer)
);

/**
 * Returns an object that is suitable to be passed to the playback slider
 * component to mark the important cues in the currently loaded show.
 */
export const getMarksFromShowCues = createSelector(getCues, (cues) =>
  uniq(cues.map((cue) => cue.time)).map((value) => ({
    value,
  }))
);

/**
 * Returns the names of the drones in the currently loaded show.
 */
export const getNamesOfDronesInShow = createSelector(
  getDroneSwarmSpecification,
  (swarm): string[] =>
    swarm.map((drone, index) =>
      String(get(drone, 'settings.name') ?? `Drone ${index + 1}`)
    )
);

/**
 * Returns the number of drones in the currently loaded show.
 */
export const getNumberOfDronesInShow = createSelector(
  getDroneSwarmSpecification,
  (swarm) => swarm.length
);

/**
 * Returns an array containing all the trajectories. The array will contain
 * undefined for all the drones that have no fixed trajectories in the mission.
 */
const getTrajectories = createSelector(getDroneSwarmSpecification, (swarm) =>
  swarm.map((drone: DroneSpecification): Trajectory | undefined => {
    const trajectory = get(drone, 'settings.trajectory');
    return isValidTrajectory(trajectory) ? trajectory : undefined;
  })
);

/**
 * Returns the duration of a single drone trajectory.
 */
const getTrajectoryDuration = (trajectory: any): number => {
  if (!isValidTrajectory(trajectory)) {
    return 0;
  }

  const { points, takeoffTime } = trajectory;

  if (points.length > 0) {
    const lastPoint = points.at(-1);
    if (Array.isArray(lastPoint) && lastPoint.length > 1) {
      return lastPoint[0] + (takeoffTime ?? 0);
    }
  }

  return 0;
};

/**
 * Returns an array containing trajectory player objects for all the
 * trajectories.
 */
export const getTrajectoryPlayers = createSelector(
  getTrajectories,
  (trajectories) => trajectories.map(createTrajectoryPlayer)
);

/**
 * Returns an array containing all the yaw controls. The array will contain
 * undefined for all the drones that have no yaw control data in the mission.
 */
const getYawControls = createSelector(getDroneSwarmSpecification, (swarm) =>
  swarm.map((drone: DroneSpecification): YawControl | undefined => {
    const yawControl = get(drone, 'settings.yawControl');
    return isValidYawControl(yawControl) ? yawControl : undefined;
  })
);

/**
 * Returns an array containing yaw control player objects
 * for all the yaw controls.
 */
export const getYawControlPlayers = createSelector(
  getYawControls,
  (yawControls) => yawControls.map((yc) => yc && createYawControlPlayer(yc))
);

/**
 * Returns the total duration of the show, in seconds.
 */
export const getShowDuration = createSelector(
  getTrajectories,
  (trajectories): number => {
    const longest = maxBy(trajectories, getTrajectoryDuration);
    return longest ? getTrajectoryDuration(longest) : 0;
  }
);

/**
 * Returns the total duration of the show, as a human-readable string.
 */
export const getShowDurationAsString = createSelector(
  getShowDuration,
  getTimestampFormatter,
  (duration, formatter) => formatter(duration)
);

/**
 * Returns the metadata of the show, if any.
 */
export const getShowMetadata = createSelector(
  (state: RootState) => state.show.data,
  (data): ShowMetadata =>
    (data && typeof data.meta === 'object' ? data.meta : null) ?? EMPTY_OBJECT
);

/**
 * Returns whether there is a show file currently loaded.
 */
export const hasLoadedShowFile = (state: RootState) => Boolean(state.show.data);

/**
 * Returns a suitable title string for the current show file.
 */
export const getShowTitle = createSelector(
  hasLoadedShowFile,
  getShowMetadata,
  getNumberOfDronesInShow,
  (hasLoadedShow, meta, droneCount) =>
    hasLoadedShow
      ? meta?.title
        ? String(meta.title)
        : `Show with ${droneCount} drones`
      : 'No show loaded'
);

/**
 * Returns whether we are currently loading a show file.
 */
export const isLoadingShowFile = (state: RootState) =>
  Boolean(state.show.loading);

/**
 * Returns whetner the last loading attempt of a show ended with an error.
 */
export const lastLoadingAttemptFailed = (state: RootState) =>
  Boolean(state.show.error);

/**
 * Returns the center of the axis-aligned bounding box of all the drones at
 * the current playback position.
 */
export const getCenterOfBoundingBoxOfDronesAt = (
  state: RootState,
  time: number
): [number, number, number] | undefined => {
  const players: TrajectoryPlayer[] = getTrajectoryPlayers(state);
  const boundingBox = {
    count: 0,
    max: [
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ],
    min: [
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    ],
  };
  const position = { x: 0, y: 0, z: 0 };

  for (const player of players) {
    player.getPositionAt(time, position);

    if (
      !Number.isFinite(position.x) ||
      !Number.isFinite(position.y) ||
      !Number.isFinite(position.z)
    ) {
      continue;
    }

    boundingBox.max[0] = Math.max(boundingBox.max[0], position.x);
    boundingBox.max[1] = Math.max(boundingBox.max[1], position.y);
    boundingBox.max[2] = Math.max(boundingBox.max[2], position.z);
    boundingBox.min[0] = Math.min(boundingBox.min[0], position.x);
    boundingBox.min[1] = Math.min(boundingBox.min[1], position.y);
    boundingBox.min[2] = Math.min(boundingBox.min[2], position.z);
    boundingBox.count++;
  }

  if (boundingBox.count) {
    return [
      (boundingBox.min[0] + boundingBox.max[0]) / 2,
      (boundingBox.min[1] + boundingBox.max[1]) / 2,
      (boundingBox.min[2] + boundingBox.max[2]) / 2,
    ];
  }

  return undefined;
};
