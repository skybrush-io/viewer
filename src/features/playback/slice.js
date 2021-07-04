/**
 * @file Slice of the state object that stores the state of the audio / video playback.
 */

import isNil from 'lodash-es/isNil';
import { createSlice } from '@reduxjs/toolkit';

const validatePlaybackSpeed = (speed) => {
  return isNil(speed) || Number.isNaN(speed) || speed <= 0 || speed >= 100
    ? null
    : speed;
};

const validateTimestamp = (timestamp) => {
  return isNil(timestamp) || Number.isNaN(timestamp) || timestamp < 0
    ? null
    : Math.round(timestamp);
};

const { actions, reducer } = createSlice({
  name: 'playback',

  initialState: {
    adjustedTo: null,
    startedAt: null,
    stoppedAt: null,
    speed: 1,
  },

  reducers: {
    setStartStopTimeAndSpeed(state, action) {
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

        state.speed = validatedSpeed ? validatedSpeed : 1;
      }

      state.adjustedTo = null;
    },

    temporarilyOverridePlaybackPosition(state, action) {
      const value = Number(action.payload);

      state.adjustedTo = !Number.isNaN(value) && value >= 0 ? value : null;
    },
  },
});

export const { setStartStopTimeAndSpeed, temporarilyOverridePlaybackPosition } =
  actions;

export default reducer;
