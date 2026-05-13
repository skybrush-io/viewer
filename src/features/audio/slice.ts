/**
 * @file Slice of the state object that stores the state of the audio playback.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { noPayload } from '@skybrush/redux-toolkit';

type AudioSliceState = {
  url: string | undefined;
  loading: boolean;
  seeking: boolean;
  muted: boolean;
  volume: number;
  startTime: number;
};

const initialState: AudioSliceState = {
  url: undefined,
  loading: false,
  seeking: false,
  muted: false,
  volume: 1,
  startTime: 0,
};

const { actions, reducer } = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    notifyAudioCanPlay: noPayload((state) => {
      state.loading = false;
    }),

    notifyAudioMetadataLoaded: noPayload((state) => {
      state.loading = true;
    }),

    notifyAudioSeeked: noPayload((state) => {
      state.seeking = false;
    }),

    notifyAudioSeeking: noPayload((state) => {
      state.seeking = true;
    }),

    setAudioUrl(state, action: PayloadAction<string | null | undefined>) {
      const { payload } = action;
      state.url = typeof payload === 'string' ? payload : undefined;
    },

    setAudioStartTime(state, action: PayloadAction<number>) {
      state.startTime = action.payload;
    },

    toggleMuted: noPayload((state) => {
      state.muted = !state.muted;
    }),
  },
});

export const {
  notifyAudioCanPlay,
  notifyAudioMetadataLoaded,
  notifyAudioSeeked,
  notifyAudioSeeking,
  setAudioUrl,
  setAudioStartTime,
  toggleMuted,
} = actions;

export default reducer;
