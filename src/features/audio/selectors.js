/**
 * Selector that returns whether there is audio associated to the currently
 * loaded show.
 */
export const hasAudio = state => state.audio.url !== null;

/**
 * Selector that returns whether the audio subsystem is ready to play the
 * audio.
 */
export const isAudioReadyToPlay = state =>
  state.audio.url === null || (!state.audio.loading && !state.audio.seeking);

/**
 * Selector that returns whether the audio playback is muted.
 */
export const isAudioMuted = state => state.audio.muted;
