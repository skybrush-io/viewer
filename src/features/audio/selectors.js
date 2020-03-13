/**
 * Selector that returns whether the audio subsystem is ready to play the
 * audio.
 */
export const isAudioReadyToPlay = state =>
  state.audio.url && !state.audio.loading && !state.audio.seeking;

/**
 * Selector that returns whether the audio playback is muted.
 */
export const isAudioMuted = state => state.audio.muted;
