import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash-es/get';

import {
  getShowDuration,
  getShowEnvironmentType,
  getTimestampFormatter,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  calculateScalarDerivative,
  calculateVectorDerivative,
  getClosestPairsAndDistances,
  projectAllToXY,
  projectAllToZ,
  sampleDurationEvenly,
  samplePositionAt,
  sampleVelocityAt,
} from './calculations';
import { DEFAULT_VALIDATION_SETTINGS, SAMPLES_PER_SECOND } from './constants';
import { type ValidationSettings } from './types';

/**
 * Selector that returns the validation settings of the current show (if any).
 */
export const getValidationSettings = createSelector(
  (state: RootState): Record<string, number> =>
    get(state, 'show.data.settings.validation') as Record<string, number>,
  getShowEnvironmentType,
  (validation, type): ValidationSettings => {
    const settings = {
      ...(DEFAULT_VALIDATION_SETTINGS[type] ||
        DEFAULT_VALIDATION_SETTINGS.outdoor),
    };

    // Unfortunately some of our show files use underscore-styled validation
    // settings instead of camelCased. We need to fix that, but until then
    // here's a compatibility workaround.
    if (validation?.max_altitude !== undefined) {
      settings.maxAltitude = validation.max_altitude;
      settings.maxVelocityXY = validation.max_velocity_xy;
      settings.maxVelocityZ = validation.max_velocity_z;
      settings.maxVelocityZUp = validation.max_velocity_z_up;
      settings.minDistance = validation.min_distance;
    } else {
      Object.assign(settings, validation);
    }

    return settings;
  }
);

/**
 * Selector that selects the altitude warning threshold from the show specification,
 * falling back to a default if needed.
 */
export const getAltitudeWarningThreshold = (state: RootState) =>
  getValidationSettings(state).maxAltitude;

/**
 * Selector that selects the horizontal velocity threshold from the show specification,
 * falling back to a default if needed.
 */
export const getHorizontalVelocityThreshold = (state: RootState) =>
  getValidationSettings(state).maxVelocityXY;

/**
 * Selector that selects the horizontal acceleration threshold from the show specification,
 * falling back to a default if needed.
 */
export const getHorizontalAccelerationThreshold = (state: RootState) =>
  getValidationSettings(state).maxAccelerationXY;

/**
 * Selector that selects the proximity warning threshold from the show specification,
 * falling back to a default if needed.
 */
export const getProximityWarningThreshold = (state: RootState) =>
  getValidationSettings(state).minDistance;

/**
 * Selector that selects the upwards vertical velocity threshold from the show specification,
 * falling back to a default if needed.
 */
export const getVerticalVelocityThresholdUp = (state: RootState) => {
  const { maxVelocityZ, maxVelocityZUp } = getValidationSettings(state);
  return typeof maxVelocityZUp === 'number' && Number.isFinite(maxVelocityZUp)
    ? maxVelocityZUp
    : maxVelocityZ;
};

/**
 * Selector that selects the downwards vertical velocity threshold from the show
 * specification, falling back to a default if needed. Note that the return
 * value is positive even though the vector points towards the negative Z axis.
 */
export const getVerticalVelocityThresholdDown = (state: RootState) =>
  getValidationSettings(state).maxVelocityZ;

/**
 * Selector that selects the upwards vertical acceleration threshold from the show specification,
 * falling back to a default if needed.
 */
export const getVerticalAccelerationThresholdUp = (state: RootState) => {
  const { maxAccelerationZ, maxAccelerationZUp } = getValidationSettings(state);
  return typeof maxAccelerationZUp === 'number' &&
    Number.isFinite(maxAccelerationZUp)
    ? maxAccelerationZUp
    : maxAccelerationZ;
};

/**
 * Selector that selects the downwards vertical acceleration threshold from the
 * show specification, falling back to a default if needed. Note that the return
 * value is positive even though the vector points towards the negative Z axis.
 */
export const getVerticalAccelerationThresholdDown = (state: RootState) =>
  getValidationSettings(state).maxAccelerationZ;

/**
 * Returns the list of time instants to sample during the validation phase.
 */
export const getSampledTimeInstants = createSelector(
  getShowDuration,
  sampleDurationEvenly
);

/**
 * Returns an array of strings, one for each sampled time instant in the
 * validation phase.
 */
export const getFormattedSampledTimeInstants = createSelector(
  getSampledTimeInstants,
  getTimestampFormatter,
  (samples, formatter) => samples.map(formatter)
);

/**
 * Returns an array mapping drones to their positions, sampled at regular
 * intervals.
 */
export const getSampledPositionsForDrones = createSelector(
  getTrajectoryPlayers,
  getSampledTimeInstants,
  (players, samples) => {
    // TODO(ntamas): make this async and make it run in a worker or at least in
    // the background so we don't lock the UI
    return players.map((player) => samplePositionAt(player, samples));
  }
);

/**
 * Returns an array mapping drones to their velocities, sampled at regular
 * intervals.
 */
export const getSampledVelocitiesForDrones = createSelector(
  getTrajectoryPlayers,
  getSampledTimeInstants,
  (players, samples) => {
    // TODO(ntamas): make this async and make it run in a worker or at least in
    // the background so we don't lock the UI
    return players.map((player) => sampleVelocityAt(player, samples));
  }
);

/**
 * Returns a function that maps from a drone index to an array containing the altitude
 * of that drone, sampled at regular intervals.
 */
export const selectSampledAltitudeGetter = createSelector(
  getSampledPositionsForDrones,
  (positions) => (index: number) => projectAllToZ(positions[index] ?? [])
);

/**
 * Returns an array mapping drones to their altitudes, sampled at regular
 * intervals.
 *
 * This function does not need to be memoized. It is a relatively simple operation,
 * but the result takes a lot of memory.
 */
export const getSampledAltitudesForAllDrones = (state: RootState) => {
  return getSampledPositionsForDrones(state).map(projectAllToZ);
};

/**
 * Returns a function that maps from a drone index to an array containing the horizontal
 * velocity of that drone, sampled at regular intervals.
 */
export const selectSampledHorizontalVelocityGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) => projectAllToXY(velocities[index] ?? [])
);

/**
 * Returns an array mapping drones to their horizontal velocities, sampled at regular
 * intervals.
 *
 * This function does not need to be memoized. It is a relatively simple operation,
 * but the result takes a lot of memory.
 */
export const getSampledHorizontalVelocitiesForDrones = (state: RootState) => {
  return getSampledVelocitiesForDrones(state).map(projectAllToXY);
};

/**
 * Returns a function that maps from a drone index to an array containing the vertical
 * velocity of that drone, sampled at regular intervals.
 */
export const selectSampledVerticalVelocityGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) => projectAllToZ(velocities[index] ?? [])
);

/**
 * Returns an array mapping drones to their vertical velocities, sampled at regular
 * intervals.
 *
 * This function does not need to be memoized. It is a relatively simple operation,
 * but the result takes a lot of memory.
 */
export const getSampledVerticalVelocitiesForDrones = (state: RootState) => {
  return getSampledVelocitiesForDrones(state).map(projectAllToZ);
};

const TIME_BETWEEN_SAMPLES = 1 / SAMPLES_PER_SECOND;

/**
 * Returns an array mapping drones to their estimated horizontal accelerations,
 * sampled at regular intervals.
 *
 * The accelerations are estimated from the velocities. In theory it would be
 * better to derive them directly from the trajectory, but the result would be
 * zero for linear segments and infinity at the points where segments join with
 * discontinuous velocities, and this is not useful for the end user.
 *
 * This function is not memoized. Although calculating the accelerations from the
 * velocities is not necessarily cheap, the result takes a lot of memory, and typically
 * we only need the _aggregated_ chart that shows the minimum and maximum acceleration
 * across all drones, which will be memoized separately.
 */
export const getSampledHorizontalAccelerationsForDrones = (
  state: RootState
) => {
  return getSampledVelocitiesForDrones(state).map((velocities) =>
    projectAllToXY(
      calculateVectorDerivative(velocities, 1, TIME_BETWEEN_SAMPLES)
    )
  );
};

/**
 * Returns a function that maps from a drone index to an array containing the horizontal
 * acceleration of that drone, sampled at regular intervals.
 */
export const selectSampledHorizontalAccelerationGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) =>
    projectAllToXY(
      calculateVectorDerivative(
        velocities[index] ?? [],
        1,
        TIME_BETWEEN_SAMPLES
      )
    )
);

/**
 * Returns an array mapping drones to their estimated vertical accelerations,
 * sampled at regular intervals.
 *
 * The accelerations are estimated from the velocities. In theory it would be
 * better to derive them directly from the trajectory, but the result would be
 * zero for linear segments and infinity at the points where segments join with
 * discontinuous velocities, and this is not useful for the end user.
 *
 * This function is not memoized. Although calculating the accelerations from the
 * velocities is not necessarily cheap, the result takes a lot of memory, and typically
 * we only need the _aggregated_ chart that shows the minimum and maximum acceleration
 * across all drones, which will be memoized separately.
 */
export const getSampledVerticalAccelerationsForDrones = (state: RootState) => {
  return getSampledVerticalVelocitiesForDrones(state).map((velocities) =>
    calculateScalarDerivative(velocities, 1, TIME_BETWEEN_SAMPLES)
  );
};

/**
 * Returns a function that maps from a drone index to an array containing the vertical
 * acceleration of that drone, sampled at regular intervals.
 */
export const selectSampledVerticalAccelerationGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) =>
    calculateScalarDerivative(
      projectAllToZ(velocities[index] ?? []),
      1,
      TIME_BETWEEN_SAMPLES
    )
);

/**
 * Returns two arrays, one mapping frames to the distance of the closest drone
 * pair in that frame, and another mapping frames to the indices of the closts
 * drone pairs in the at frame. Each item of the array may be undefined if the frame
 * has at most one drone.
 */
export const getNearestNeighborsAndDistancesForFrames = createSelector(
  getSampledPositionsForDrones,
  getSampledTimeInstants,
  getClosestPairsAndDistances
);

const EMPTY_SELECTION: string[] = [];

/**
 * Returns the list of item IDs (drones or groups) that are selected.
 */
export const getSelection = (state: RootState) =>
  state.validation.selection || EMPTY_SELECTION;

/**
 * Returns an object that maps item IDs (drones or groups) to their indices
 * in the selection.
 */
export const getSelectionToChartIndexMapping = createSelector(
  getSelection,
  (selection) => {
    const mapping: Record<string, number> = {};

    for (const [index, itemId] of selection.entries()) {
      mapping[itemId] = index;
    }

    return mapping;
  }
);

/**
 * Returns the list of visible panels.
 */
export const getVisiblePanels = (state: RootState) =>
  state.validation.visiblePanels;

/**
 * Returns whether the given item ID is selected.
 */
export const isItemSelected = (state: RootState, itemId: string) =>
  getSelection(state).includes(itemId);

/**
 * Returns whether there is at least one item that is explicitly selected.
 */
export const isSelectionEmpty = (state: RootState) =>
  getSelection(state).length === 0;
