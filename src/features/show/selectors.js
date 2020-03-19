import get from 'lodash-es/get';
import maxBy from 'lodash-es/maxBy';

import { createSelector } from '@reduxjs/toolkit';

import { formatPlaybackTimestamp } from '~/utils/formatters';
import createLightProgramPlayer from '~/utils/lights';
import createTrajectoryPlayer from '~/utils/trajectory';

/**
 * Returns whether a trajectory object "looks like" a valid trajectory.
 */
export const isValidTrajectory = trajectory =>
  typeof trajectory === 'object' &&
  trajectory.version === 1 &&
  typeof trajectory.points === 'object' &&
  Array.isArray(trajectory.points);

/**
 * Returns whether a trajectory object "looks like" a valid light program.
 */
export const isValidLightProgram = program =>
  typeof program === 'object' &&
  program.version === 1 &&
  typeof program.data === 'string';

/**
 * Returns the common show settings that apply to all drones in the currently
 * loaded show.
 */
export const getCommonShowSettings = state => {
  const result = get(state, 'show.data.settings');
  return typeof result === 'object' ? result : {};
};

/**
 * Returns the specification of the drone swarm in the currently loaded show.
 */
export const getDroneSwarmSpecification = state => {
  const result = get(state, 'show.data.swarm.drones');
  return Array.isArray(result) ? result : [];
};

/**
 * Returns the initial configuration of the camera in the drone show.
 */
export const getInitialCameraConfigurationOfShow = () => ({
  position: [0, 20, 50], // [-52.9, 9.93, 0.22],
  rotation: [0, 0, 0] // [0, -114.6, 0]
});

/**
 * Returns an array containing all the light programs. The array will contain
 * undefined for all the drones that have no light programs in the mission.
 */
const getLightPrograms = createSelector(getDroneSwarmSpecification, swarm =>
  swarm.map(drone => {
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
  lightPrograms => lightPrograms.map(createLightProgramPlayer)
);

/**
 * Returns the number of drones in the currently loaded show.
 */
export const getNumberOfDronesInShow = createSelector(
  getDroneSwarmSpecification,
  swarm => swarm.length
);

/**
 * Returns an array containing all the trajectories. The array will contain
 * undefined for all the drones that have no fixed trajectories in the mission.
 */
const getTrajectories = createSelector(getDroneSwarmSpecification, swarm =>
  swarm.map(drone => {
    const trajectory = get(drone, 'settings.trajectory');
    return isValidTrajectory(trajectory) ? trajectory : undefined;
  })
);

/**
 * Returns the duration of a single drone trajectory.
 */
const getTrajectoryDuration = trajectory => {
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
  trajectories => trajectories.map(createTrajectoryPlayer)
);

/**
 * Returns the total duration of the show, in seconds.
 */
export const getShowDuration = createSelector(getTrajectories, trajectories => {
  const longest = maxBy(trajectories, getTrajectoryDuration);
  return longest ? getTrajectoryDuration(longest) : 0;
});

/**
 * Returns the total duration of the show, as a human-readable string.
 */
export const getShowDurationAsString = createSelector(
  getShowDuration,
  formatPlaybackTimestamp
);

/**
 * Returns the metadata of the show, if any.
 */
export const getShowMetadata = createSelector(
  state => state.show.data,
  data => (data && typeof data.meta === 'object' ? data.meta : null) || {}
);

/**
 * Returns a suitable title string for the current show file.
 */
export const getShowTitle = createSelector(
  getShowMetadata,
  getNumberOfDronesInShow,
  (meta, numDrones) => meta.title || `Show with ${numDrones} drones`
);

/**
 * Returns whether there is a show file currently loaded.
 */
export const hasLoadedShowFile = state => Boolean(state.show.data);

/**
 * Returns whether we are currently loading a show file.
 */
export const isLoadingShowFile = state => state.show.loading;
