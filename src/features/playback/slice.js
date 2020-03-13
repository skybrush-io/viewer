/**
 * @file Slice of the state object that stores the state of the audio / video playback.
 */

import isNil from 'lodash-es/isNil';
import { createSlice } from '@reduxjs/toolkit';

const validateTimestamp = timestamp => {
  return isNil(timestamp) || isNaN(timestamp) || timestamp < 0
    ? null
    : Math.round(timestamp);
};

const { actions, reducer } = createSlice({
  name: 'playback',

  initialState: {
    adjustedTo: null,
    startedAt: null,
    stoppedAt: null
  },

  reducers: {
    setStartAndStopTime(state, action) {
      const { start, stop } = action.payload;

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

      state.adjustedTo = null;
    },

    temporarilyOverridePlaybackPosition(state, action) {
      const value = Number(action.payload);

      if (!isNaN(value) && value >= 0) {
        state.adjustedTo = value;
      } else {
        state.adjustedTo = null;
      }
    }
  }
});

export const {
  setStartAndStopTime,
  temporarilyOverridePlaybackPosition
} = actions;

export default reducer;
