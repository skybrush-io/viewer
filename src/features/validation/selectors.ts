import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash-es/get';
import range from 'lodash-es/range';

import { type Vector3 } from '@skybrush/show-format';

import {
  getShowDuration,
  getShowEnvironmentType,
  getTimestampFormatter,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import getClosestPair from './closest-pair';
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
 * Returns whether there is at least one validation message in the message store.
 */
export const hasValidationMessages = (state: RootState) =>
  state?.validation?.messages?.order &&
  state.validation.messages.order.length > 0;

/**
 * Returns the list of time instants to sample during the validation phase.
 */
export const getSampledTimeInstants = createSelector(
  getShowDuration,
  (duration) => {
    const numberSamples = Math.ceil(duration * SAMPLES_PER_SECOND);
    const result = range(numberSamples).map((x) => x / SAMPLES_PER_SECOND);

    if (result.length > 0 && result.at(-1)! < duration) {
      result.push(duration);
    }

    return result;
  }
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
    return players.map((player) =>
      samples.map((time) =>
        player.getPositionAt(time, {
          x: 0,
          y: 0,
          z: 0,
          t: time,
        } as any as Vector3)
      )
    );
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
    return players.map((player) =>
      samples.map((time) =>
        player.getVelocityAt(time, {
          x: 0,
          y: 0,
          z: 0,
          t: time,
        } as any as Vector3)
      )
    );
  }
);

/**
 * Projects a 3D vector to the XY plane and returns the length of the projected vector.
 */
const projectToXY = (coord: Vector3) => Math.hypot(coord.x, coord.y);

/**
 * Projects a 3D vector to the Z axis.
 */
const projectToZ = (coord: Vector3) => coord.z;

/**
 * Calculates the derivative of a vector of scalars where the derivative at
 * index i is estimated from the values at indices (i-k) and (i+k), i.e. we
 * are using the midpoint method with a step size of k.
 */
export function calculateScalarDerivative(
  values: number[],
  numSteps = 1,
  dt = 1
): number[] {
  const n = values.length;
  const result: number[] = Array.from({ length: n });
  const scale = 2 * numSteps * dt;
  for (let i = numSteps; i < n - numSteps; i++) {
    result[i] = (values[i + numSteps] - values[i - numSteps]) / scale;
  }

  // Fill the endpoints
  if (n >= 2 * numSteps + 1) {
    for (let i = 0; i < numSteps; i++) {
      result[i] = result[numSteps];
      result[n - i - 1] = result[n - numSteps - 1];
    }
  } else {
    result.fill(0);
  }

  return result;
}

/**
 * Calculates the derivative of a vector of 3D vectors where the derivative at
 * index i is estimated from the vectors at indices (i-k) and (i+k), i.e. we
 * are using the midpoint method with a step size of k.
 */
export function calculateVectorDerivative(
  values: Vector3[],
  numSteps = 1,
  dt = 1
): Vector3[] {
  const n = values.length;
  const result: Vector3[] = Array.from({ length: n });
  const scale = 2 * numSteps * dt;
  for (let i = numSteps; i < n - numSteps; i++) {
    result[i] = {
      x: (values[i + numSteps].x - values[i - numSteps].x) / scale,
      y: (values[i + numSteps].y - values[i - numSteps].y) / scale,
      z: (values[i + numSteps].z - values[i - numSteps].z) / scale,
    };
  }

  // Fill the endpoints
  if (n >= 2 * numSteps + 1) {
    for (let i = 0; i < numSteps; i++) {
      result[i] = result[numSteps];
      result[n - i - 1] = result[n - numSteps - 1];
    }
  } else {
    const ZERO = { x: 0, y: 0, z: 0 };
    result.fill(ZERO);
  }

  return result;
}

/**
 * Returns an array mapping drones to their altitudes, sampled at regular
 * intervals.
 */
export const getSampledAltitudesForDrones = createSelector(
  getSampledPositionsForDrones,
  (positionsByDrones) => {
    return positionsByDrones.map((positions) => positions.map(projectToZ));
  }
);

/**
 * Returns an array mapping drones to their horizontal velocities, sampled at regular
 * intervals.
 */
export const getSampledHorizontalVelocitiesForDrones = createSelector(
  getSampledVelocitiesForDrones,
  (velocitiesByDrones) => {
    return velocitiesByDrones.map((velocities) => velocities.map(projectToXY));
  }
);

/**
 * Returns an array mapping drones to their vertical velocities, sampled at regular
 * intervals.
 */
export const getSampledVerticalVelocitiesForDrones = createSelector(
  getSampledVelocitiesForDrones,
  (velocitiesByDrones) => {
    return velocitiesByDrones.map((velocities) => velocities.map(projectToZ));
  }
);

/**
 * Returns an array mapping drones to their estimated horizontal accelerations,
 * sampled at regular intervals.
 *
 * The accelerations are estimated from the velocities. In theory it would be
 * better to derive them directly from the trajectory, but the result would be
 * zero for linear segments and infinity at the points where segments join with
 * discontinuous velocities, and this is not useful for the end user.
 */
export const getSampledHorizontalAccelerationsForDrones = createSelector(
  getSampledVelocitiesForDrones,
  (velocitiesByDrones) => {
    const dt = 1 / SAMPLES_PER_SECOND;
    return velocitiesByDrones.map((velocities) => {
      return calculateVectorDerivative(velocities, 1, dt).map(projectToXY);
    });
  }
);

/**
 * Returns an array mapping drones to their estimated vertical accelerations,
 * sampled at regular intervals.
 *
 * The accelerations are estimated from the velocities. In theory it would be
 * better to derive them directly from the trajectory, but the result would be
 * zero for linear segments and infinity at the points where segments join with
 * discontinuous velocities, and this is not useful for the end user.
 */
export const getSampledVerticalAccelerationsForDrones = createSelector(
  getSampledVerticalVelocitiesForDrones,
  (velocitiesByDrones) => {
    const dt = 1 / SAMPLES_PER_SECOND;
    return velocitiesByDrones.map((velocities) =>
      calculateScalarDerivative(velocities, 1, dt)
    );
  }
);

const arePositionsAlmostEqual = (
  a: Vector3,
  b: Vector3 | undefined,
  eps = 0.05
): boolean =>
  b !== undefined &&
  Math.abs(a.x - b.x) < eps &&
  Math.abs(a.y - b.y) < eps &&
  Math.abs(a.z - b.z) < eps;

/**
 * Returns two arrays, one mapping frames to the distance of the closest drone
 * pair in that frame, and another mapping frames to the indices of the closts
 * drone pairs in the at frame. Each item of the array may be null if the frame
 * has at most one drone.
 */
export const getNearestNeighborsAndDistancesForFrames = createSelector(
  getSampledPositionsForDrones,
  getSampledTimeInstants,
  (
    positionsByDrones,
    times
  ): [Array<number | null>, Array<[number, number] | null>] => {
    // TODO(ntamas): make this async and make it run in a worker or at least in
    // the background so we don't lock the UI
    const frameCount = times.length;
    const droneCount = positionsByDrones.length;
    const distances: Array<number | null> = Array.from({ length: frameCount });
    const indices: Array<[number, number] | null> = Array.from({
      length: frameCount,
    });
    const indexMap: number[] = [];
    const positionsInCurrentFrame: Vector3[] = [];

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      // We collect only those drones that are not at their takeoff or landing
      // positions. This is to provide sensible results for multi-stage shows
      // where half of the fleet is idling on the ground while the other half is
      // flying; in this case we are not interested in the minimum distance between
      // the drones on the ground, only between the flying ones.
      //
      // So, positionsInCurrentFrame will contain only the positions of the active drones,
      // and indexMap[i] contains the index of the i-th active drone.
      indexMap.length = 0;
      positionsInCurrentFrame.length = 0;
      for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
        const pos = positionsByDrones[droneIndex];
        if (
          !arePositionsAlmostEqual(pos[frameIndex], pos.at(0)) &&
          !arePositionsAlmostEqual(pos[frameIndex], pos.at(-1))
        ) {
          indexMap.push(droneIndex);
          positionsInCurrentFrame.push(pos[frameIndex]);
        }
      }

      // If all drones are idle, we can consider all of them for the closest pair calculation
      if (positionsInCurrentFrame.length === 0) {
        for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
          const pos = positionsByDrones[droneIndex];
          indexMap.push(droneIndex);
          positionsInCurrentFrame.push(pos[frameIndex]);
        }
      }

      const closestPair = getClosestPair(positionsInCurrentFrame);
      if (closestPair) {
        const firstIndex =
          indexMap[positionsInCurrentFrame.indexOf(closestPair[0])];
        const secondIndex =
          indexMap[positionsInCurrentFrame.indexOf(closestPair[1])];

        distances[frameIndex] = Math.hypot(
          closestPair[0].x - closestPair[1].x,
          closestPair[0].y - closestPair[1].y,
          closestPair[0].z - closestPair[1].z
        );
        indices[frameIndex] =
          firstIndex < secondIndex
            ? [firstIndex, secondIndex]
            : [secondIndex, firstIndex];
      } else {
        distances[frameIndex] = null;
        indices[frameIndex] = null;
      }
    }

    return [distances, indices];
  }
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
