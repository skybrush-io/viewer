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
    }
  }
});

export const { setStartAndStopTime } = actions;

export default reducer;
