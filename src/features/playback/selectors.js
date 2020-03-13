import isNil from 'lodash-es/isNil';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Selector that returns a getter function that can be invoked with a timestamp
 * and that will return the number of seconds elapsed in the show at the given
 * timestamp, based on the state of the playback.
 */
export const getElapsedSecondsGetter = createSelector(
  state => state.playback.startedAt,
  state => state.playback.stoppedAt,
  state => state.playback.adjustedTo,
  (startedAt, stoppedAt, adjustedTo) => (timestamp = null) => {
    if (!isNil(adjustedTo)) {
      return adjustedTo;
    }

    if (timestamp === null) {
      timestamp = Date.now();
    }

    if (!startedAt || timestamp < startedAt) {
      return 0;
    }

    if (stoppedAt && timestamp > stoppedAt) {
      return (stoppedAt - startedAt) / 1000;
    }

    return (timestamp - startedAt) / 1000;
  }
);

/**
 * Returns whether the user is currently adjusting the playback position by
 * dragging the thumb on the playback slider.
 */
export const isAdjustingPlaybackPosition = state =>
  isNil(state.playback.adjustedTo);

/**
 * Returns whether we are currently playing the drone show.
 */
export const isPlaying = state =>
  state.playback.startedAt && !state.playback.stoppedAt;
