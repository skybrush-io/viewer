/**
 * Formats a drone label given its index.
 *
 * This function is essentially used to declare that we are sticking to a 1-based
 * indexing when showing drone labels.
 */
export function formatDroneIndex(index: number): string {
  return String(index + 1);
}

/**
 * Formats a timestamp expressed in seconds in a way that is suitable as a
 * "playback timestamp" in the playback slider.
 */
export function formatPlaybackTimestamp(
  seconds: number,
  { digits = 0 }: { digits?: number } = {}
): string {
  if (!Number.isFinite(seconds)) {
    return '--:--';
  }

  if (seconds < 0) {
    return `-${formatPlaybackTimestamp(-seconds)}`;
  }

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const formattedSeconds =
    digits === 0 ? String(Math.floor(seconds)) : seconds.toFixed(digits);
  return `${minutes}:${
    seconds < 10 ? `0${formattedSeconds}` : formattedSeconds
  }`;
}

/**
 * Formats a timestamp expressed in seconds in a minutes:seconds+frames
 * represetation.
 */
export function formatPlaybackTimestampAsFrames(
  seconds: number,
  fps: number
): string {
  if (!Number.isFinite(seconds) || fps <= 0) {
    return '--:--+--';
  }

  if (seconds < 0) {
    return `-${formatPlaybackTimestampAsFrames(-seconds, fps)}`;
  }

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const formattedSeconds = String(Math.floor(seconds)).padStart(2, '0');
  const frames = String(
    Math.round((seconds - Math.floor(seconds)) * fps)
  ).padStart(fps >= 10 ? 2 : 1, '0');
  return `${minutes}:${formattedSeconds}+${frames}`;
}
