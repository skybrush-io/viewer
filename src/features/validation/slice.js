/**
 * @file Slice of the state object that stores the settings of the current drone
 * show being executed.
 */

import { createSlice } from '@reduxjs/toolkit';

import { clearLoadedShow } from '~/features/show/slice';

import { removeAllMessages } from './utils';

const { actions, reducer } = createSlice({
  name: 'validation',

  initialState: {
    messages: {
      byId: {},
      order: [],
    },
  },

  reducers: {},

  extraReducers: {
    [clearLoadedShow]: (state) => {
      removeAllMessages(state);
    },
  },
});

// export const { clearLoadedShow, requestToLoadShow } = actions;

export default reducer;
