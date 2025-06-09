/**
 * @file Slice of the state object that stores the state of the audio / video playback.
 */

import isNil from 'lodash-es/isNil';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const validatePlaybackSpeed = (speed: number | null | undefined) => {
  return isNil(speed) || Number.isNaN(speed) || speed <= 0 || speed >= 100
    ? null
    : speed;
};

const validateTimestamp = (timestamp: number | null | undefined) => {
  return isNil(timestamp) || Number.isNaN(timestamp) || timestamp < 0
    ? null
    : Math.round(timestamp);
};

interface PlaybackSliceState {
  /**
   * Timestamp that the playhead was explicitly adjusted to, in milliseconds.
   * Used only when the user is dragging the playhead. null if the
   * playhead is not currently being adjusted. This value is used to override
   * the normal playback position calculation, which is based on the startedAt
   * and stoppedAt timestamps.
   */
  adjustedTo: number | null;

  /**
   * Timestamp when the playback started, in milliseconds. null if the playback
   * was never started. Rounded to the nearest millisecond.
   */
  startedAt: number | null;

  /**
   * Timestamp when the playback stopped, in milliseconds. null if the playback
   * was never stopped (which does not mean it is currently playing). Rounded
   * to the nearest millisecond.
   */
  stoppedAt: number | null;

  /**
   * Multiplier for the playback speed. 1 means normal speed, 2 means double
   * speed, 0.5 means half speed, etc. Must be a positive number.
   */
  speed: number;
}

const initialState: PlaybackSliceState = {
  adjustedTo: null,
  startedAt: null,
  stoppedAt: null,
  speed: 1,
};

const { actions, reducer } = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    setStartStopTimeAndSpeed(
      state,
      action: PayloadAction<{
        start?: number | null;
        stop?: number | null;
        speed?: number;
      }>
    ) {
      const { start, stop, speed } = action.payload;

      if (start !== undefined) {
        state.startedAt = validateTimestamp(start);
      }

      if (stop !== undefined) {
        const validatedStop = validateTimestamp(stop);

        if (validatedStop) {
          state.stoppedAt = state.startedAt
            ? Math.max(state.startedAt, validatedStop)
            : null;
        } else {
          state.stoppedAt = null;
        }
      }

      if (speed !== undefined) {
        const validatedSpeed = validatePlaybackSpeed(speed);

        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        state.speed = validatedSpeed ? validatedSpeed : 1;
      }

      state.adjustedTo = null;
    },

    setAdjustedTo(state, action: PayloadAction<number>) {
      const value = Number(action.payload);

      state.adjustedTo = !Number.isNaN(value) && value >= 0 ? value : null;
    },
  },
});

export const { setStartStopTimeAndSpeed, setAdjustedTo } = actions;

export default reducer;
