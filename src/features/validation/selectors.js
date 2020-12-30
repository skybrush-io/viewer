import range from 'lodash-es/range';
import { createSelector } from '@reduxjs/toolkit';

import {
  getShowDuration,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import { SAMPLES_PER_SECOND } from './constants';

/**
 * Returns whether there is at least one validation message in the message store.
 */
export const hasValidationMessages = (state) =>
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
  (samples) => samples.map(formatPlaybackTimestamp)
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
      samples.map((time) => player.getPositionAt(time, { t: time }))
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
      samples.map((time) => player.getVelocityAt(time, { t: time }))
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
 * Returns the list of item IDs (drones or groups) that are selected.
 */
export const getSelection = (state) => state.validation.selection || [];

/**
 * Returns an object that maps item IDs (drones or groups) to their indices
 * in the selection.
 */
export const getSelectionToChartIndexMapping = createSelector(
  getSelection,
  (selection) => {
    const mapping = {};
    selection.forEach((itemId, index) => {
      mapping[itemId] = index;
    });
    return mapping;
  }
);

/**
 * Returns the list of visible panels.
 */
export const getVisiblePanels = (state) => state.validation.visiblePanels;

/**
 * Returns whether the given item ID is selected.
 */
export const isItemSelected = (state, itemId) =>
  getSelection(state).includes(itemId);

/**
 * Returns whether there is at least one item that is explicitly selected.
 */
export const isSelectionEmpty = (state) => getSelection(state).length === 0;
