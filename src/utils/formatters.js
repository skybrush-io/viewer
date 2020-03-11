/**
 * Formats a timestamp expressed in seconds in a way that is suitable as a
 * "playback timestamp" in the playback slider.
 */
export function formatPlaybackTimestamp(seconds) {
  if (!isFinite(seconds)) {
    return '--:--';
  }

  if (seconds < 0) {
    return `-${formatPlaybackTimestamp(-seconds)}`;
  }

  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds - minutes * 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
