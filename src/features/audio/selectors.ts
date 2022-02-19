import type { RootState } from '~/store';

/**
 * Selector that returns the current audio URL.
 */
export const getCurrentAudioUrl = (state: RootState): string | undefined =>
  state.audio.url;

/**
 * Selector that returns whether there is audio associated to the currently
 * loaded show.
 */
export const hasAudio = (state: RootState) => state.audio.url !== undefined;

/**
 * Selector that returns whether the audio subsystem is ready to play the
 * audio.
 */
export const isAudioReadyToPlay = (state: RootState) =>
  !hasAudio(state) || (!state.audio.loading && !state.audio.seeking);

/**
 * Selector that returns whether the audio playback is muted.
 */
export const isAudioMuted = (state: RootState): boolean => state.audio.muted;
