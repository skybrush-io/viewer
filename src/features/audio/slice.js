/**
 * @file Slice of the state object that stores the state of the audio playback.
 */

import { createSlice } from '@reduxjs/toolkit';

import { noPayload } from '~/utils/redux';

const { actions, reducer } = createSlice({
  name: 'audio',

  initialState: {
    url: null,
    loading: false,
    seeking: false,
    muted: false,
    volume: 1
  },

  reducers: {
    notifyAudioCanPlay: noPayload(state => {
      state.loading = false;
    }),

    notifyAudioMetadataLoaded: noPayload(state => {
      state.loading = true;
    }),

    notifyAudioSeeked: noPayload(state => {
      state.seeking = false;
    }),

    notifyAudioSeeking: noPayload(state => {
      state.seeking = true;
    }),

    setAudioUrl(state, action) {
      const { payload } = action;
      state.url = typeof payload === 'string' ? payload : null;
    },

    toggleMuted: noPayload(state => {
      state.muted = !state.muted;
    })
  }
});

export const {
  notifyAudioCanPlay,
  notifyAudioMetadataLoaded,
  notifyAudioSeeked,
  notifyAudioSeeking,
  setAudioUrl,
  toggleMuted
} = actions;

export default reducer;
