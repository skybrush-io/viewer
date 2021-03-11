import config from 'config';
import get from 'lodash-es/get';
import maxBy from 'lodash-es/maxBy';

import { createSelector } from '@reduxjs/toolkit';

import {
  createTrajectoryPlayer,
  validateTrajectory,
} from '@skybrush/show-format';

import { formatPlaybackTimestamp } from '~/utils/formatters';
import createLightProgramPlayer from '~/utils/lights';

export const canLoadShowFromLocalFile = () => config.io.localFiles;

const EMPTY_OBJECT = Object.freeze({});

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
  (state) => get(state, 'show.data.meta'),
  (meta) => {
    const offset = meta ? meta.getTimestampOffset : 0;

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
  (offset) => {
    return offset === 0
      ? formatPlaybackTimestamp
      : (value) => formatPlaybackTimestamp(value + offset);
  }
);

/**
 * Returns whether a trajectory object "looks like" a valid trajectory.
 */
export const isValidTrajectory = (trajectory) => {
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
export const isValidLightProgram = (program) =>
  typeof program === 'object' &&
  program.version === 1 &&
  typeof program.data === 'string';

/**
 * Returns the common show settings that apply to all drones in the currently
 * loaded show.
 */
export const getCommonShowSettings = (state) => {
  const result = get(state, 'show.data.settings');
  return typeof result === 'object' ? result : EMPTY_OBJECT;
};

/**
 * Returns the specification of the drone swarm in the currently loaded show.
 */
export const getDroneSwarmSpecification = (state) => {
  const result = get(state, 'show.data.swarm.drones');
  return Array.isArray(result) ? result : [];
};

/**
 * Returns a unique ID for the currently loaded show so 3D components can
 * reset the camera position when a new show is loaded.
 */
export const getLoadedShowId = (state) => state.show.id;

/**
 * Selector that returns the type of the show (indoor or outdoor).
 */
export const getShowEnvironmentType = (state) =>
  get(state, 'show.data.environment.type') || 'outdoor';

/**
 * Selector that returns whether the show is indoor.
 */
export const isShowIndoor = (state) =>
  getShowEnvironmentType(state) === 'indoor';

/**
 * Selector that returns whether the show is outdoor.
 */
export const isShowOutdoor = (state) =>
  getShowEnvironmentType(state) === 'outdoor';

/**
 * Returns an array containing all the light programs. The array will contain
 * undefined for all the drones that have no light programs in the mission.
 */
const getLightPrograms = createSelector(getDroneSwarmSpecification, (swarm) =>
  swarm.map((drone) => {
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
 * Returns the names of the drones in the currently loaded show.
 */
export const getNamesOfDronesInShow = createSelector(
  getDroneSwarmSpecification,
  (swarm) =>
    swarm.map((drone, index) => get(drone, 'name') || `Drone ${index + 1}`)
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
  swarm.map((drone) => {
    const trajectory = get(drone, 'settings.trajectory');
    return isValidTrajectory(trajectory) ? trajectory : undefined;
  })
);

/**
 * Returns the duration of a single drone trajectory.
 */
const getTrajectoryDuration = (trajectory) => {
  if (!isValidTrajectory(trajectory)) {
    return 0;
  }

  const { points, takeoffTime } = trajectory;

  if (points.length > 0) {
    const lastPoint = points[points.length - 1];
    if (Array.isArray(lastPoint) && lastPoint.length > 1) {
      return lastPoint[0] + (takeoffTime || 0);
    }
  } else {
    return 0;
  }
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
 * Returns the total duration of the show, in seconds.
 */
export const getShowDuration = createSelector(
  getTrajectories,
  (trajectories) => {
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
  (state) => state.show.data,
  (data) =>
    (data && typeof data.meta === 'object' ? data.meta : null) || EMPTY_OBJECT
);

/**
 * Returns a suitable title string for the current show file.
 */
export const getShowTitle = createSelector(
  getShowMetadata,
  getNumberOfDronesInShow,
  (meta, numberDrones) => meta.title || `Show with ${numberDrones} drones`
);

/**
 * Returns whether there is a show file currently loaded.
 */
export const hasLoadedShowFile = (state) => Boolean(state.show.data);

/**
 * Returns whether we are currently loading a show file.
 */
export const isLoadingShowFile = (state) => state.show.loading;
