import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash-es/get';

import {
  getShowDuration,
  getShowEnvironmentType,
  getTimestampFormatter,
  getTrajectoryPlayers,
  getYawControlPlayers,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import {
  calculateScalarDerivative,
  projectVector3ArrayToXY,
  projectVector3ArrayToZ,
  sampleDurationEvenly,
  samplePositionAt,
  sampleVelocityAt,
  sampleYawAt,
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
      settings.maxAccelerationXY = validation.max_acceleration_xy;
      settings.maxAccelerationZ = validation.max_acceleration_z;
      settings.maxAltitude = validation.max_altitude;
      settings.maxVelocityXY = validation.max_velocity_xy;
      settings.maxVelocityZ = validation.max_velocity_z;
      settings.maxVelocityZUp = validation.max_velocity_z_up;
      settings.maxYawRate = validation.max_yaw_rate;
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
 * Selector that selects the yaw rate warning threshold from the show specification,
 * falling back to a default if needed.
 */
export const getYawRateWarningThreshold = (state: RootState) =>
  getValidationSettings(state).maxYawRate;


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
  (positions) => (index: number) => projectVector3ArrayToZ(positions[index])
);

/**
 * Returns an array mapping drones to their altitudes, sampled at regular
 * intervals.
 *
 * This function does not need to be memoized. It is a relatively simple operation,
 * but the result takes a lot of memory.
 */
export const getSampledAltitudesForAllDrones = (state: RootState) => {
  return getSampledPositionsForDrones(state).map(projectVector3ArrayToZ);
};

/**
 * Returns a function that maps from a drone index to an array containing the horizontal
 * velocity of that drone, sampled at regular intervals.
 */
export const selectSampledHorizontalVelocityGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) => projectVector3ArrayToXY(velocities[index])
);

/**
 * Returns an array mapping drones to their horizontal velocities, sampled at regular
 * intervals.
 *
 * This function does not need to be memoized. It is a relatively simple operation,
 * but the result takes a lot of memory.
 */
export const getSampledHorizontalVelocitiesForDrones = (state: RootState) => {
  return getSampledVelocitiesForDrones(state).map(projectVector3ArrayToXY);
};

/**
 * Returns a function that maps from a drone index to an array containing the vertical
 * velocity of that drone, sampled at regular intervals.
 */
export const selectSampledVerticalVelocityGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) => projectVector3ArrayToZ(velocities[index])
);

/**
 * Returns an array mapping drones to their vertical velocities, sampled at regular
 * intervals.
 *
 * This function does not need to be memoized. It is a relatively simple operation,
 * but the result takes a lot of memory.
 */
export const getSampledVerticalVelocitiesForDrones = (state: RootState) => {
  return getSampledVelocitiesForDrones(state).map(projectVector3ArrayToZ);
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
    projectVector3ArrayToXY(velocities.derivative({ dt: TIME_BETWEEN_SAMPLES }))
  );
};

/**
 * Returns a function that maps from a drone index to an array containing the horizontal
 * acceleration of that drone, sampled at regular intervals.
 */
export const selectSampledHorizontalAccelerationGetter = createSelector(
  getSampledVelocitiesForDrones,
  (velocities) => (index: number) =>
    projectVector3ArrayToXY(
      velocities[index].derivative({ dt: TIME_BETWEEN_SAMPLES })
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
      projectVector3ArrayToZ(velocities[index]),
      1,
      TIME_BETWEEN_SAMPLES
    )
);

/**
 * Returns an array mapping drones to their yaw angles in radians, 
 * sampled at regular intervals.
 */
export const getSampledYawForDrones = createSelector(
  getYawControlPlayers,
  getSampledTimeInstants,
  (players, samples) => {
    // TODO(ntamas): make this async and make it run in a worker or at least in
    // the background so we don't lock the UI
    return players.map((player) =>
      player
        ? sampleYawAt(player, samples)
        : Array.from({ length: samples.length }, () => 0)
    );
  }
);

/**
 * Returns a function that maps from a drone index to an array containing the yaw
 * of that drone, in degrees, sampled at regular intervals.
 */
export const selectSampledYawGetter = createSelector(
  getSampledYawForDrones,
  (yaws) => (index: number) => yaws[index].map((rad) => rad * 180 / Math.PI)
);


/**
 * Returns an array mapping drones to their estimated yaw rates in radians,
 * sampled at regular intervals.
 *
 * The yaw rates are estimated from the yaw angles. In theory it would be
 * better to derive them directly from the yaw control player, but that is
 * not implemented yet.
 *
 * This function is not memoized. Although calculating the yaw rates from the
 * yaw angles is not necessarily cheap, the result takes a lot of memory, and typically
 * we only need the _aggregated_ chart that shows the minimum and maximum yaw rate
 * across all drones, which will be memoized separately.
 */
export const getSampledYawRatesForDrones = (
  state: RootState
) => {
  return getSampledYawForDrones(state).map((yaws) =>
    calculateScalarDerivative(yaws, 1, TIME_BETWEEN_SAMPLES)
  );
};

/**
 * Returns a function that maps from a drone index to an array containing the
 * yaw rate of that drone in [deg/s], sampled at regular intervals.
 */
export const selectSampledYawRateGetter = createSelector(
  getSampledYawRatesForDrones,
  (yaw_rates) => (index: number) => yaw_rates[index].map((rad) => rad * 180 / Math.PI)
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
