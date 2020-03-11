/**
 * Returns the number of seconds elapsed since the start of the show until now
 * or until the playback was stopped, whichever is earliest.
 */
export const getElapsedSecondsAt = (state, timestamp = null) => {
  const { startedAt, stoppedAt } = state.playback;

  if (!startedAt || timestamp < startedAt) {
    return 0;
  }

  if (stoppedAt && timestamp > stoppedAt) {
    return (stoppedAt - startedAt) / 1000;
  }

  return (timestamp - startedAt) / 1000;
};

/**
 * Returns the number of seconds elapsed since the start of the show until
 * the given timestamp or until the playback was stopped, whichever is
 * earliest.
 */
export const getElapsedSeconds = state =>
  getElapsedSecondsAt(state, Date.now());

/**
 * Returns whether we are currently playing the drone show.
 */
export const isPlaying = state =>
  state.playback.startedAt && !state.playback.stoppedAt;
