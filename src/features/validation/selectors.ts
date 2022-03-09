import get from 'lodash-es/get';
import range from 'lodash-es/range';
import { createSelector } from '@reduxjs/toolkit';

import { ThreeJsVector } from '@skybrush/show-format';

import {
  getShowDuration,
  getShowEnvironmentType,
  getTimestampFormatter,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import getClosestPair from './closest-pair';
import { DEFAULT_VALIDATION_SETTINGS, SAMPLES_PER_SECOND } from './constants';
import { ValidationSettings } from './types';

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
    if (validation && validation.max_altitude !== undefined) {
      settings.maxAltitude = validation.max_altitude;
      settings.maxVelocityXY = validation.max_velocity_xy;
      settings.maxVelocityZ = validation.max_velocity_z;
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
 * Selector that selects the proximity warning threshold from the show specification,
 * falling back to a default if needed.
 */
export const getProximityWarningThreshold = (state: RootState) =>
  getValidationSettings(state).minDistance;

/**
 * Selector that selects the vertical velocity threshold from the show specification,
 * falling back to a default if needed.
 */
export const getVerticalVelocityThreshold = (state: RootState) =>
  getValidationSettings(state).maxVelocityZ;

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

    if (result.length > 0 && result[result.length - 1] < duration) {
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
        player.getPositionAt(time, { x: 0, y: 0, z: 0, t: time })
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
        player.getVelocityAt(time, { x: 0, y: 0, z: 0, t: time })
      )
    );
  }
);

/**
 * Returns an array mapping drones to their altitudes, sampled at regular
 * intervals.
 */
export const getSampledAltitudesForDrones = createSelector(
  getSampledPositionsForDrones,
  (positionsByDrones) => {
    return positionsByDrones.map((positions) =>
      positions.map((coord) => coord.z)
    );
  }
);

/**
 * Returns an array mapping drones to their horizontal velocities, sampled at regular
 * intervals.
 */
export const getSampledHorizontalVelocitiesForDrones = createSelector(
  getSampledVelocitiesForDrones,
  (velocitiesByDrones) => {
    return velocitiesByDrones.map((velocities) =>
      velocities.map((coord) => Math.hypot(coord.x, coord.y))
    );
  }
);

/**
 * Returns an array mapping drones to their vertical velocities, sampled at regular
 * intervals.
 */
export const getSampledVerticalVelocitiesForDrones = createSelector(
  getSampledVelocitiesForDrones,
  (velocitiesByDrones) => {
    return velocitiesByDrones.map((velocities) =>
      velocities.map((coord) => coord.z)
    );
  }
);

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
    const positionsInCurrentFrame: ThreeJsVector[] = Array.from({
      length: droneCount,
    });

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      for (let droneIndex = 0; droneIndex < droneCount; droneIndex++) {
        positionsInCurrentFrame[droneIndex] =
          positionsByDrones[droneIndex][frameIndex];
      }

      const closestPair = getClosestPair(positionsInCurrentFrame);
      if (closestPair) {
        const firstIndex = positionsInCurrentFrame.indexOf(closestPair[0]);
        const secondIndex = positionsInCurrentFrame.indexOf(closestPair[1]);

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
